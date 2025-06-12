//////// Настройка Express
let express = require(`express`);
let app = express();
app.use(express.json());
app.use(express.static('public'));

// Инициализация сервера
let port = 3000;
app.listen(port, function () {
    console.log(`Сервер запущен: http://localhost:${port}`)
});

// Подключение политики cors, запрещающей подключение к сайту с разным портов.
let cors = require('cors')
app.use(cors({
    origin: ["http://localhost:5173", "https://sweetdreams-confectionary.ru"], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true // Разрешаем передачу cookie
}));  


//////// НАСТРОЙКА СЕССИЙ И ИХ ХРАНЕНИЯ В MONGODB
let session = require('express-session');

//Задача URI для MongoDB
let MongoURI = 'mongodb://127.0.0.1:27017/NAVI';

//Создание объекта для хранения в MongoDB сессий
let MongoDBSession = require('connect-mongodb-session')(session)
let store = new MongoDBSession({
    uri: MongoURI,
    collection: 'userSessions'
});

// Настройка сессии
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
      maxAge: (86400000 * 7) , // Время жизни cookie (24 часа)
      secure: false, // Для HTTPS измените на true
      httpOnly: true, // Запретить доступ к cookie через JavaScript
      sameSite: 'lax' // Защита от CSRF
  }
}));

//////// НАСТРОЙКА БД

// Настройка БД
let mongoose = require('mongoose');
mongoose.connect(MongoURI);

// СОЗДАНИЕ СХЕМ ДАННЫХ ДЛЯ КОЛЕКЦИЙ.
let schemaNews = new mongoose.Schema({
  Title: String,
  Text: String,
  ImagePath: String,
  category: String,
},
{ 
  //Создание временных "марок"
  timestamps: true 
});

let News = mongoose.model('news', schemaNews);

let schemaUsers = new mongoose.Schema({
  Name: String,
  Surname: String,
  Gender: String,
  Tel: Number,
  Email: String,
  Password: String,

  Ironings: [{
    _id: false, // Отключаем авто-генерацию
    IronYear: Number,
    IronMonth: Number,
    IronDay: Number,

    IroningTimes: [{
      _id: false,
      PlatformID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gaiming_equipments' // Связь с коллекцией gaiming_equipments
      },
      IronHours: Array,
      SummaryIroningPrice: Number,
    }],
  }]
},
{ 
  //Создание временных "марок"    
  timestamps: true 
});

let Users = mongoose.model('users', schemaUsers);

let schemaReviews = new mongoose.Schema({
  UserID: String,
  ReviewText: String
},
{ 
  //Создание временных "марок"
  timestamps: true 
});

let Reviews = mongoose.model('reviews', schemaReviews);

let schemaGaimingEquipment = new mongoose.Schema({
  Order: String,
  ModelName: String,
  ImagePath: String,

  Specifications: [{
    _id: false, // Отключаем авто-генерацию
    SpecName: String,
    SpecValue: String
  }],
  
  platform: String,

  InstalledGames: [{
    _id: false, // Отключаем авто-генерацию
    Name: String,
    Genre: String,
  }],

  IroningTimes: [{
    _id: false, // Отключаем авто-генерацию
    IronYear: Number,
    IronMonth: Number,
    IronDay: Number,
    IronHours: Array,
  }]


  
},{ 
  //Создание временных "марок"
  timestamps: true 
});

let GaimingEquipment = mongoose.model('gaiming_equipments', schemaGaimingEquipment);




//////// РОУТЫ

// GET
app.get('/user_comments', async function (req, res) {
  let UserReviews = await Reviews.find().lean();

  for (i = 0; UserReviews.length > i; i++) {
      let User = await Users.findById(UserReviews[i].UserID);

      UserReviews[i].Name = User.Name;
      UserReviews[i].Surname = User.Surname;
      UserReviews[i].Gender = User.Gender;
  };

  res.send(UserReviews);
});

app.get('/gaimingequipment', async function (req, res) {
  try {
    const { Selected_Category_Platforms, Selected_Genre } = req.query;

    let filter = {};

    filter.platform = {$in: Selected_Category_Platforms};
    
    if (Selected_Genre != "(Отсутствует)") {
      filter['InstalledGames.Genre'] = Selected_Genre;
    }
    
    const Equipment = await GaimingEquipment.find(filter);

    res.send(Equipment);

  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/news', async function (req, res) {
  try {
    const {SelectedCategories} = req.query;
    // Формируем фильтрацию
    let filter = {};
    
    if (SelectedCategories) {
      filter.category = { 
        $in: Array.isArray(SelectedCategories) 
        ? SelectedCategories 
        : [SelectedCategories] 
      };
    } 
    else {
      // Если категории не переданы - возвращаем пустой результат
      filter.category = { $in: [] };
    }
    
    const news = await News.find(filter);
    
    res.send(news);

  } catch (error) {
    console.error('Ошибка при получении каталога:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/me', async (req, res) => {
  try {
    //Проверка наличия сессии (пользовательского ID сохраненного в ней)
    if (!req.session.userId) return res.status(401).json({ message: 'Данная страница доступна только авторизованным пользователям' });
      
    //Получаем пользователя из его ID
    const user = await (await Users.findById(req.session.userId).select('-Password -createdAt -updatedAt -__v')).populate({
      path: 'Ironings.IroningTimes.PlatformID', 
      select: 'Order ModelName ImagePath' // Выбираем нужные поля
  });
      
    //Успех
    res.status(200).json({ user }); 

  } catch (error) {
    console.error('Ошибка в /api/me:', error);  
    res.status(500).json({ message: 'Внутренная ошибка сервера' });
  }
});

// app.get('/user', async function(req,res) {
//   let { User_id } = req.body;



// })


// POST
app.post('/registration', async function (req, res) {
  try {
    let Name = req.body.Name;
    let Surname = req.body.Surname;
    let Email = req.body.Email;
    let Tel = req.body.Tel;
    let Password = req.body.Password;

    //Проверяем наличие данных
    if (!Name || !Surname || !Email || !Tel || !Password ) {
      return res.sendStatus(400);
    };
    
    //Проверяем наличие уже зарегистриованного пользователя (По Телефону, и Почте)
    let UserIsAlreadyExist = await Users.findOne({Tel: Tel}) 
    if (UserIsAlreadyExist) {
      return res.status(400).json({ message: 'Пользователь с данным номером телефона уже зарегистрирован' });
    }
    else {
      UserIsAlreadyExist = await Users.findOne({Email: Email})
      if (UserIsAlreadyExist) {
        return res.status(400).json({ message: 'Пользователь с данным почтой уже зарегистрирован' });
      }
    }

      
    //Создаем "нового пользователя", в которого записываем все данные
    let user = new Users({
      Name: Name,
      Surname: Surname,
      Email: Email,
      Tel: Tel,
      Password: Password
    });

    //Добавляем в БД
    await user.save();
    
    //Отправляем статус коды и сообщения
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      userId: user._id
    });
  
    } catch (error) {
    res.status(500).json({
      message: 'Внутренняя ошибка сервера',
      error: error.message
    })
  }
});

app.post('/login', async function(req, res) {
  try {
    let Email = req.body.Email;
    let Password = req.body.Password;

    //Проверяем наличие данных
    if (!Email || !Password ) {
      return res.status(400).json({ 
        message: 'Ошибка в Почте или Пароле' 
      });
    };
    let User = await Users.findOne({'Email': Email, 'Password': Password});
    if (User) {
      req.session.isAuth = true; // Создаем сессию (тем, что добавляем в него что ни-будь)
      req.session.userId = User._id; // Сохраняем ID пользователя
      console.log(req.session.userId);
      // Отправляем успешный ответ
      res.status(200).json({
        message: 'Авторизация успешна',
        user: { id: User._id, email: User.Email }
      });
        
    } else {
      // Отправляем сообщение об ошибке
      res.status(401).json({ 
        message: 'Неверный email или пароль' 
      });
    }
  
  } catch (error) {
    // Отправляем сообщение об ошибке
    res.status(500).json({
      message: 'Внутренняя ошибка сервера',
      error: error.message
    });
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Ошибка при выходе из системы' });
    
    res.clearCookie('connect.sid'); // Очистка куки сессии
    res.status(200).json({ message: 'Вы успешно вышли из системы' });
  });
});


// PATCH
app.patch('/gaiming_equipment/making_ironing', async function(req, res) {
  let { 
    GaimingEquipment_id,
    Selected_IroningTimes,
    UserDateYear,
    UserDateMonth,
    UserDateDate,
    User_id,
    SummaryIroningPrice

  } = req.body;

  console.log(Selected_IroningTimes);

  

  let EquipmentForPatch = await GaimingEquipment.findById(GaimingEquipment_id);
  let UserForPatch = await Users.findById(User_id);


  // Добавление бронирования в БД Платформы
  const PlatformBooking = EquipmentForPatch.IroningTimes.find(b => 
    b.IronYear == UserDateYear &&
    b.IronMonth == UserDateMonth &&
    b.IronDay == UserDateDate
  );

  if (PlatformBooking) {
    console.log("Есть бронирования платформы на текущую дату");
    
    const LastBooking = EquipmentForPatch.IroningTimes.at(-1);

    if (LastBooking) {
      LastBooking.IronHours.push(...Selected_IroningTimes);
      console.log("Нет бронирования пользователя для текущей платформы - Добавил в IronHours ...Selected_IroningTimes");
    } else {
      LastBooking.IronHours = Selected_IroningTimes;
      console.log("Нет бронирования пользователя для текущей платформы - Создал IronHours, добавил туда Selected_IroningTimes");
    }
  }
  else {
    console.log("Нет бронирований платформы на текущую дату");

    EquipmentForPatch.IroningTimes.push({
      IronYear: UserDateYear,
      IronMonth: UserDateMonth,
      IronDay: UserDateDate,
      IronHours: Selected_IroningTimes
    });
    console.log("Нет бронирований платформы на текущую дату - Свежая хуйня");
  }


  // Добавление бронирования в БД Пользователя
  const LastUserBooking = UserForPatch.Ironings.find(b => 
    b.IronYear == UserDateYear &&
    b.IronMonth == UserDateMonth &&
    b.IronDay == UserDateDate
  );

  if (LastUserBooking) {
    console.log("Есть бронирования пользователя на текущую дату");

    LastUserBooking.IroningTimes.push({
      PlatformID: GaimingEquipment_id,
      IronHours: Selected_IroningTimes,
      SummaryIroningPrice: SummaryIroningPrice
    });

    // const platformBooking = userBooking.IroningTimes.find(t => t.PlatformID == GaimingEquipment_id);

    // if (platformBooking) {
    //   platformBooking.IronHours.push(...Selected_IroningTimes);
    //   console.log("Есть бронирование пользователя для текущей платформы - добавил часы");
    // } else {
    //   userBooking.IroningTimes.push({
    //     PlatformID: GaimingEquipment_id,
    //     IronHours: Selected_IroningTimes
    //   });
    //   console.log("Нет бронирования пользователя для текущей платформы - Создал IroningTimes, добавил туда PlatfromID и IronHours");
    // }

    

  // Если у нас нет бронирований на текущую дату
  } else {
    console.log("Нет бронирований пользователя на текущую дату");

    UserForPatch.Ironings.push({
      IronYear: UserDateYear,
      IronMonth: UserDateMonth,
      IronDay: UserDateDate,
      IroningTimes: [{
        PlatformID: GaimingEquipment_id,
        IronHours: Selected_IroningTimes,
        SummaryIroningPrice: SummaryIroningPrice
      }]
    });
    console.log("Нет бронирований пользователя на текущую дату - Свежая хуйня");
  }
  


  await EquipmentForPatch.save();
  await UserForPatch.save();

  
  res.sendStatus(201);
  console.log(EquipmentForPatch);


});

app.get('user/ironings', async function(req,res) {

});
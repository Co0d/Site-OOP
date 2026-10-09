const APP_DATA = {
	/*DATABASE*/
    database: {
        title: "Нормальные формы баз данных",
        description: "Нормализация — это процесс организации данных в базе данных. Он включает создание таблиц и установление связей между ними в соответствии с правилами, призванными защитить данные и сделать базу данных более гибкой.",
        content: "<p>Рассмотрим процесс нормализации на примере одной таблицы. Предположим, у нас есть база данных медицинского центра, которая хранит информацию о пациентах, врачах, приёмах и назначенных лекарствах.</p>",
        example_table: {
            headers: ["ID_записи", "Пациент", "Телефон", "Врач", "Специализация", "Дата", "Диагноз", "Лекарство", "Дозировка"],
            rows: [
                ["1", "Иванов И.И.", "+7-900-123-45-67", "Петров П.П.", "Терапевт",   "2024-01-15", "ОРВИ",       "Арбидол",   "200мг"],
                ["2", "Иванов И.И.", "+7-900-123-45-67", "Сидоров С.С.", "Кардиолог", "2024-01-20", "Гипертония", "Эналаприл", "10мг"],
                ["3", "Смирнова А.А.", "+7-900-765-43-21", "Петров П.П.", "Терапевт", "2024-01-16", "ОРВИ",       "Арбидол",   "200мг"],
                ["4", "Смирнова А.А.", "+7-900-765-43-21", "Петров П.П.", "Терапевт", "2024-01-16", "ОРВИ",       "Кагоцел",   "12мг"],
                ["5", "Козлов Д.В.", "+7-900-555-55-55", "Сидоров С.С.", "Кардиолог", "2024-01-22", "Аритмия",   "Кордарон",  "200мг"]
            ]
        },
        "1nf": {
            title: "Первая нормальная форма (1НФ)",
            description: "Таблица находится в 1НФ, если все её атрибуты атомарны (неделимы), нет повторяющихся групп и у каждой строки есть уникальный первичный ключ.",
            problem: "В исходной таблице данные дублируются: телефон пациента повторяется для каждого его приёма, специализация врача — для каждого назначения. Если у пациента появится второй телефон или несколько диагнозов, придётся либо плодить строки, либо писать несколько значений в одну ячейку — а это уже нарушение атомарности.",
            solution: "Привести таблицу к виду, где каждая ячейка содержит одно значение, а все строки уникальны. Фактически таблица уже находится в 1НФ — но пока с избыточностью. Для наглядности покажем её ещё раз как есть, но с явным первичным ключом ID_записи.",
            table: {
                headers: ["ID_записи (PK)", "Пациент", "Телефон", "Врач", "Специализация", "Дата", "Диагноз", "Лекарство", "Дозировка"],
                rows: [
                    ["1", "Иванов И.И.",   "+7-900-123-45-67", "Петров П.П.", "Терапевт",   "2024-01-15", "ОРВИ",       "Арбидол",   "200мг"],
                    ["2", "Иванов И.И.",   "+7-900-123-45-67", "Сидоров С.С.", "Кардиолог", "2024-01-20", "Гипертония", "Эналаприл", "10мг"],
                    ["3", "Смирнова А.А.", "+7-900-765-43-21", "Петров П.П.", "Терапевт",   "2024-01-16", "ОРВИ",       "Арбидол",   "200мг"],
                    ["4", "Смирнова А.А.", "+7-900-765-43-21", "Петров П.П.", "Терапевт",   "2024-01-16", "ОРВИ",       "Кагоцел",   "12мг"],
                    ["5", "Козлов Д.В.",   "+7-900-555-55-55", "Сидоров С.С.", "Кардиолог", "2024-01-22", "Аритмия",   "Кордарон",  "200мг"]
                ]
            }
        },
        "2nf": {
            title: "Вторая нормальная форма (2НФ)",
            description: "Таблица находится во 2НФ, если она находится в 1НФ и все неключевые атрибуты полностью зависят от всего первичного ключа (нет частичных зависимостей).",
            problem: "В таблице 1НФ часть данных зависит не от первичного ключа (ID_записи), а от его части: телефон зависит только от пациента, а специализация — только от врача. Это частичная зависимость и причина дублирования.",
            solution: "Разделить таблицу на несколько: пациенты, врачи, приёмы, лекарства и связующая таблица назначенных лекарств. Данные о пациенте и о враче теперь хранятся в одном месте.",
            table: {
                headers: ["Таблица", "Поля"],
                rows: [
                    ["Пациенты",  "ID_пациента (PK), ФИО, Телефон"],
                    ["Врачи",     "ID_врача (PK), ФИО, ID_специализации (FK)"],
                    ["Приёмы",    "ID_приёма (PK), ID_пациента (FK), ID_врача (FK), Дата, ID_диагноза (FK)"],
                    ["Лекарства", "ID_лекарства (PK), Название, Дозировка"],
                    ["Назначения","ID_приёма (FK), ID_лекарства (FK)"]
                ]
            }
        },
        "3nf": {
            title: "Третья нормальная форма (3НФ)",
            description: "Таблица находится в 3НФ, если она находится во 2НФ и нет транзитивных зависимостей: неключевой атрибут не зависит от другого неключевого атрибута.",
            problem: "На шаге 2НФ в таблице «Приёмы» остался диагноз как текст. Если диагноз имеет свойства (код по МКБ, категория), они будут зависеть не от приёма, а от диагноза — это транзитивная зависимость. То же касается специализации врача.",
            solution: "Вынести диагнозы и специализации в отдельные справочные таблицы, а в основных оставить только внешние ключи.",
            table: {
                headers: ["Таблица", "Поля"],
                rows: [
                    ["Пациенты",     "ID_пациента (PK), ФИО, Телефон"],
                    ["Специализации","ID_специализации (PK), Название"],
                    ["Врачи",        "ID_врача (PK), ФИО, ID_специализации (FK)"],
                    ["Диагнозы",     "ID_диагноза (PK), Название, Код_МКБ"],
                    ["Приёмы",       "ID_приёма (PK), ID_пациента (FK), ID_врача (FK), Дата, ID_диагноза (FK)"],
                    ["Лекарства",    "ID_лекарства (PK), Название, Дозировка"],
                    ["Назначения",   "ID_приёма (FK), ID_лекарства (FK)"]
                ]
            }
        },
        "bcnf": {
            title: "Нормальная форма Бойса-Кодда (НФБК)",
            description: "Таблица находится в НФБК, если она в 3НФ и каждый её детерминант (атрибут, от которого функционально зависят другие) является потенциальным ключом.",
            problem: "В 3НФ иногда остаются аномалии, если в таблице несколько перекрывающихся потенциальных ключей. Классический пример — таблица «Врач — Пациент — Специализация», где один врач может вести несколько специализаций.",
            solution: "Декомпозировать таблицу так, чтобы каждый детерминант стал потенциальным ключом. В нашем случае — вынести связь «врач ↔ специализация» в отдельную таблицу.",
            table: {
                headers: ["Таблица", "Поля"],
                rows: [
                    ["Пациенты",           "ID_пациента (PK), ФИО, Телефон"],
                    ["Специализации",      "ID_специализации (PK), Название"],
                    ["Врачи",              "ID_врача (PK), ФИО"],
                    ["Врач_Специализация", "ID_врача (FK), ID_специализации (FK) — составной PK"],
                    ["Диагнозы",           "ID_диагноза (PK), Название, Код_МКБ"],
                    ["Приёмы",             "ID_приёма (PK), ID_пациента (FK), ID_врача (FK), Дата, ID_диагноза (FK)"],
                    ["Лекарства",          "ID_лекарства (PK), Название, Дозировка"],
                    ["Назначения",         "ID_приёма (FK), ID_лекарства (FK)"]
                ]
            }
        },
        "4nf": {
            title: "Четвёртая нормальная форма (4НФ)",
            description: "Таблица находится в 4НФ, если она в НФБК и не содержит многозначных зависимостей — ситуаций, когда один атрибут определяет независимые наборы значений другого атрибута.",
            problem: "Пример: у врача может быть несколько специализаций и одновременно несколько мест работы — это независимые множества. Если хранить их в одной таблице, получим декартово произведение строк.",
            solution: "Разбить такие многозначные зависимости на отдельные таблицы.",
            table: {
                headers: ["Таблица", "Поля"],
                rows: [
                    ["Врач_Специализация", "ID_врача (FK), ID_специализации (FK)"],
                    ["Врач_Место_работы",  "ID_врача (FK), ID_учреждения (FK)"]
                ]
            }
        },
        "5nf": {
            title: "Пятая нормальная форма (5НФ)",
            description: "Таблица находится в 5НФ, если она в 4НФ и не содержит зависимостей соединения: её нельзя разбить на несколько таблиц, соединение которых даст ту же информацию, что и исходная таблица.",
            problem: "Зависимость соединения возникает, когда тройственная связь (например, «пациент — врач — лекарство») может быть восстановлена соединением трёх бинарных отношений, но при этом не является их простой суммой.",
            solution: "Декомпозировать таблицу до тех пор, пока каждая из получившихся таблиц не будет содержать только связи между двумя сущностями.",
            table: {
                headers: ["Таблица", "Поля"],
                rows: [
                    ["Пациент_Врач",      "ID_пациента (FK), ID_врача (FK)"],
                    ["Врач_Лекарство",    "ID_врача (FK), ID_лекарства (FK)"],
                    ["Пациент_Лекарство", "ID_пациента (FK), ID_лекарства (FK)"]
                ]
            }
        },
        "6nf": {
            title: "Шестая нормальная форма (6НФ)",
            description: "Таблица находится в 6НФ, если она в 5НФ и не содержит нетривиальных зависимостей соединения. На практике это означает, что таблица разбита до уровня отдельных атрибутов (по одной колонке на таблицу).",
            problem: "6НФ — теоретическая концепция. Она редко применяется, потому что чрезмерная декомпозиция усложняет запросы и снижает производительность. Но она полезна для понимания пределов нормализации.",
            solution: "Каждый атрибут — в отдельной таблице, связанной с сущностью по ID. На практике вместо этого обычно используют версионирование и темпоральные БД.",
            table: {
                headers: ["Таблица", "Поля"],
                rows: [
                    ["Пациент_ФИО",      "ID_пациента (FK), ФИО, Дата_с"],
                    ["Пациент_Телефон",  "ID_пациента (FK), Телефон, Дата_с"],
                    ["Врач_ФИО",         "ID_врача (FK), ФИО, Дата_с"],
                    ["Приём_Дата",       "ID_приёма (FK), Дата, Дата_с"]
                ]
            }
        }
    },

    /*DELPHI*/
    delphi: {
        title: "Delphi",
        description: "Delphi — это среда разработки и язык программирования, основанный на Object Pascal. Широко используется для создания Windows-приложений, кроссплатформенных решений и корпоративных систем.",
        description_block: {
            title: "Описание",
            content: "<p>Delphi сочетает высокопроизводительный компилятор, богатую библиотеку компонентов (VCL/FireMonkey) и удобную среду разработки. Язык Object Pascal отличается строгой типизацией, читаемым синтаксисом и высокой скоростью работы — как у C++, но с более понятным кодом.</p><p>Delphi применяется для разработки настольных приложений, клиент-серверных систем, работы с базами данных и мобильных приложений.</p>"
        },
        syntax: {
            title: "Синтаксис и основы языка",
            description: "Программа на Delphi состоит из модулей (unit) или программ (program). Каждый модуль делится на секции: interface (что видно другим), implementation (реализация), initialization и finalization.",
            examples: [
                {
                    text: "Минимальная консольная программа:",
                    code: "program HelloWorld;\n\n{$APPTYPE CONSOLE}\n\nuses\n  System.SysUtils;\n\nbegin\n  WriteLn('Привет, мир!');\n  ReadLn;\nend."
                },
                {
                    text: "Переменные и вывод:",
                    code: "var\n  name: string;\n  age: Integer;\nbegin\n  name := 'Иван';\n  age := 30;\n  WriteLn('Имя: ', name, ', Возраст: ', age);\nend;"
                },
                {
                    text: "Цикл for:",
                    code: "var\n  i: Integer;\nbegin\n  for i := 1 to 10 do\n    WriteLn(i);\nend;"
                },
                {
                    text: "Условный оператор:",
                    code: "var\n  x: Integer;\nbegin\n  x := 5;\n  if x > 0 then\n    WriteLn('Положительное')\n  else\n    WriteLn('Отрицательное или ноль');\nend;"
                },
                {
                    text: "Массивы:",
                    code: "var\n  nums: array[1..5] of Integer;\n  i: Integer;\nbegin\n  for i := 1 to 5 do\n    nums[i] := i * 10;\n  for i := 1 to 5 do\n    WriteLn(nums[i]);\nend;"
                }
            ]
        }
    },

    /*OOP*/
    oop: {
        title: "Объектно-ориентированное программирование (ООП)",
        description: "ООП — методология программирования, в которой программа представляется как совокупность объектов — экземпляров классов, а классы образуют иерархию наследования.",
        principles: {
            title: "Основные принципы ООП",
            content: "<p>ООП строится на четырёх принципах: <b>инкапсуляция</b>, <b>наследование</b>, <b>полиморфизм</b> и <b>абстракция</b>. Вместе они позволяют создавать гибкие, расширяемые и поддерживаемые системы.</p><ul><li>Инкапсуляция — скрытие внутренней реализации.</li><li>Наследование — повторное использование кода через иерархию классов.</li><li>Полиморфизм — единый интерфейс для разных типов.</li><li>Абстракция — выделение существенного и отбрасывание деталей.</li></ul>"
        },
        encapsulation: {
            title: "Инкапсуляция",
            description: "Инкапсуляция — объединение данных и методов работы с ними внутри класса и скрытие внутренней реализации от внешнего кода. Доступ к данным — только через публичные методы и свойства.",
            code: "type\n  TPatient = class\n  private\n    FName: string;\n    FAge: Integer;\n  public\n    constructor Create(const AName: string; AAge: Integer);\n    procedure ShowInfo;\n    property Name: string read FName write FName;\n    property Age: Integer read FAge write FAge;\n  end;\n\nconstructor TPatient.Create(const AName: string; AAge: Integer);\nbegin\n  FName := AName;\n  FAge := AAge;\nend;\n\nprocedure TPatient.ShowInfo;\nbegin\n  WriteLn('Пациент: ', FName, ', Возраст: ', FAge);\nend;"
        },
        inheritance: {
            title: "Наследование",
            description: "Наследование позволяет создавать новый класс на основе существующего, перенимая его поля и методы и добавляя новые. Базовый класс называют родительским, новый — потомком.",
            code: "type\n  TPerson = class\n  private\n    FName: string;\n  public\n    constructor Create(const AName: string);\n    procedure ShowInfo; virtual;\n  end;\n\n  TDoctor = class(TPerson)\n  private\n    FSpecialization: string;\n  public\n    constructor Create(const AName, ASpecialization: string);\n    procedure ShowInfo; override;\n  end;\n\nconstructor TPerson.Create(const AName: string);\nbegin\n  FName := AName;\nend;\n\nprocedure TPerson.ShowInfo;\nbegin\n  WriteLn('Человек: ', FName);\nend;\n\nconstructor TDoctor.Create(const AName, ASpecialization: string);\nbegin\n  inherited Create(AName);\n  FSpecialization := ASpecialization;\nend;\n\nprocedure TDoctor.ShowInfo;\nbegin\n  WriteLn('Врач: ', FName, ', Специализация: ', FSpecialization);\nend;"
        },
        polymorphism: {
            title: "Полиморфизм",
            description: "Полиморфизм позволяет работать с объектами разных классов через единый интерфейс. Вызов одного и того же метода приводит к разному поведению в зависимости от реального типа объекта.",
            code: "type\n  TShape = class\n    procedure Draw; virtual; abstract;\n  end;\n\n  TCircle = class(TShape)\n    procedure Draw; override;\n  end;\n\n  TSquare = class(TShape)\n    procedure Draw; override;\n  end;\n\nprocedure TCircle.Draw;\nbegin\n  WriteLn('Рисуем круг');\nend;\n\nprocedure TSquare.Draw;\nbegin\n  WriteLn('Рисуем квадрат');\nend;\n\nvar\n  Shapes: array[0..1] of TShape;\nbegin\n  Shapes[0] := TCircle.Create;\n  Shapes[1] := TSquare.Create;\n  for var i := 0 to 1 do\n    Shapes[i].Draw;\nend;"
        },
        abstraction: {
            title: "Абстракция",
            description: "Абстракция — выделение существенных характеристик объекта и игнорирование несущественных. В Delphi реализуется через абстрактные классы и интерфейсы.",
            code: "type\n  TAnimal = class\n    procedure MakeSound; virtual; abstract;\n  end;\n\n  TDog = class(TAnimal)\n    procedure MakeSound; override;\n  end;\n\n  TCat = class(TAnimal)\n    procedure MakeSound; override;\n  end;\n\nprocedure TDog.MakeSound;\nbegin\n  WriteLn('Гав-гав');\nend;\n\nprocedure TCat.MakeSound;\nbegin\n  WriteLn('Мяу');\nend;"
        },
        "access-modifiers": {
            title: "Модификаторы доступа",
            description: "Модификаторы доступа определяют, кто может обращаться к полям и методам класса. В Delphi их пять: private, protected, public, published и strict private/protected.",
            code: "type\n  TMyClass = class\n  private\n    FPrivateField: Integer;   // только внутри класса\n  protected\n    FProtectedField: Integer; // класс и его потомки\n  public\n    FPublicField: Integer;    // все\n  published\n    FPublishedField: Integer; // как public + RTTI\n    procedure ShowFields;\n  end;\n\nprocedure TMyClass.ShowFields;\nbegin\n  WriteLn('Private: ', FPrivateField);\n  WriteLn('Protected: ', FProtectedField);\n  WriteLn('Public: ', FPublicField);\nend;"
        },
        "friend-class": {
            title: "Дружественный класс",
            description: "В Delphi нет прямого аналога friend-классов из C++. Однако если два класса объявлены в одном модуле (unit), они видят private-члены друг друга.",
            code: "unit MyUnit;\n\ninterface\n\ntype\n  TClassA = class\n  private\n    FValue: Integer;\n  public\n    constructor Create;\n  end;\n\n  TClassB = class\n  public\n    procedure AccessA(A: TClassA);\n  end;\n\nimplementation\n\nconstructor TClassA.Create;\nbegin\n  FValue := 42;\nend;\n\nprocedure TClassB.AccessA(A: TClassA);\nbegin\n  // Имеет доступ к private-полю, потому что тот же модуль\n  WriteLn(A.FValue);\nend;\n\nend."
        },
        keywords: {
            title: "Abstract, Virtual, Override, Overload, Interface",
            description: "Ключевые слова, необходимые для реализации ООП в Delphi.",
            examples: [
                { text: "Abstract — абстрактный метод без реализации (обязателен для потомков).", code: "type\n  TBase = class\n    procedure DoWork; virtual; abstract;\n  end;" },
                { text: "Virtual — виртуальный метод, который можно переопределить.", code: "type\n  TBase = class\n    procedure DoWork; virtual;\n  end;" },
                { text: "Override — переопределение виртуального метода в потомке.", code: "type\n  TDerived = class(TBase)\n    procedure DoWork; override;\n  end;" },
                { text: "Overload — несколько методов с одним именем и разными параметрами.", code: "type\n  TCalc = class\n    function Add(A, B: Integer): Integer; overload;\n    function Add(A, B: Double): Double; overload;\n  end;" },
                { text: "Interface — контракт, который обязуется реализовать класс.", code: "type\n  IPrintable = interface\n    procedure Print;\n  end;\n\n  TDocument = class(TInterfacedObject, IPrintable)\n    procedure Print;\n  end;" }
            ]
        }
    },

    /*SOLID*/
    solid: {
        title: "SOLID",
        description: "SOLID — это пять основных принципов проектирования классов в ООП, сформулированных Робертом Мартином. Они помогают создавать гибкие, поддерживаемые и расширяемые системы.",
        description_block: {
            title: "Описание SOLID",
            content: "<p><b>S</b> — Single Responsibility Principle;</p><p><b>O</b> — Open/Closed Principle;</p><p><b>L</b> — Liskov Substitution Principle;</p><p><b>I</b> — Interface Segregation Principle;</p><p><b>D</b> — Dependency Inversion Principle.</p><p>Каждый принцип описывает отдельный аспект проектирования классов и их взаимодействия.</p>"
        },
        srp: {
            title: "SRP — Принцип единственной обязанности",
            description: "У класса должна быть только одна причина для изменения. Класс должен решать одну задачу.",
            problem: "Если класс делает несколько вещей (например, генерирует отчёт, сохраняет его в файл и печатает), любое изменение в одной из этих задач затронет класс целиком.",
            solution: "Разделить класс на несколько, каждый со своей ответственностью.",
            code: "type\n  // Плохо — класс делает всё сразу\n  TReport = class\n    procedure Generate;\n    procedure SaveToFile;\n    procedure Print;\n  end;\n\n  // Хорошо — обязанности разделены\n  TReportGenerator = class\n    function Generate: string;\n  end;\n\n  TReportSaver = class\n    procedure Save(const Report: string);\n  end;\n\n  TReportPrinter = class\n    procedure Print(const Report: string);\n  end;"
        },
        ocp: {
            title: "OCP — Принцип открытости/закрытости",
            description: "Программные сущности должны быть открыты для расширения, но закрыты для модификации.",
            problem: "Если для добавления новой фигуры нужно править существующий код, велик риск сломать уже работающее.",
            solution: "Использовать абстракции и наследование: новые фигуры добавляются без правок существующего кода.",
            code: "type\n  TShape = class\n    function Area: Double; virtual; abstract;\n  end;\n\n  TCircle = class(TShape)\n    function Area: Double; override;\n  end;\n\n  TSquare = class(TShape)\n    function Area: Double; override;\n  end;\n\n  // Новая фигура — просто новый класс, старый код не меняется."
        },
        lsp: {
            title: "LSP — Принцип подстановки Лисков",
            description: "Объекты наследника должны быть заменяемы объектами базового класса без нарушения работы программы.",
            problem: "Наследник может изменить поведение так, что использование его вместо базового класса приведёт к ошибке.",
            solution: "Проектировать иерархию так, чтобы наследники полностью соблюдали контракт родителя.",
            code: "type\n  TBird = class\n    procedure Fly; virtual;\n  end;\n\n  // Пингвин НЕ должен наследоваться от TBird,\n  // потому что он не летает — это нарушит LSP.\n\n  TFlyingBird = class\n    procedure Fly; virtual; abstract;\n  end;\n\n  TPenguin = class\n    procedure Swim;\n  end;"
        },
        isp: {
            title: "ISP — Принцип разделения интерфейсов",
            description: "Клиенты не должны зависеть от методов, которыми не пользуются.",
            problem: "Один большой интерфейс заставляет всех его реализаторов писать методы, которые им не нужны.",
            solution: "Разделить большой интерфейс на несколько маленьких, специализированных.",
            code: "type\n  IWorkable = interface\n    procedure Work;\n  end;\n\n  IEatable = interface\n    procedure Eat;\n  end;\n\n  TRobot = class(TInterfacedObject, IWorkable)\n    procedure Work;\n  end;\n\n  THuman = class(TInterfacedObject, IWorkable, IEatable)\n    procedure Work;\n    procedure Eat;\n  end;"
        },
        dip: {
            title: "DIP — Принцип инверсии зависимостей",
            description: "Абстракции не должны зависеть от деталей. Детали должны зависеть от абстракций.",
            problem: "Если высокоуровневый код напрямую создаёт конкретные объекты, его сложно тестировать и менять.",
            solution: "Ввести интерфейс и внедрять зависимость извне (Dependency Injection).",
            code: "type\n  IDatabase = interface\n    procedure Save(const Data: string);\n  end;\n\n  TMySQLDatabase = class(TInterfacedObject, IDatabase)\n    procedure Save(const Data: string);\n  end;\n\n  TPostgresDatabase = class(TInterfacedObject, IDatabase)\n    procedure Save(const Data: string);\n  end;\n\n  TDataService = class\n  private\n    FDatabase: IDatabase;\n  public\n    constructor Create(ADatabase: IDatabase);\n  end;"
        }
    },

    /*GRASP*/
    grasp: {
        title: "GRASP",
        description: "GRASP (General Responsibility Assignment Software Patterns) — общие шаблоны распределения ответственностей. Это набор принципов для назначения обязанностей классам и объектам в ООП.",
        description_block: {
            title: "Описание GRASP",
            content: "<p>GRASP состоит из <b>5 основных</b> и <b>4 дополнительных</b> шаблонов. В отличие от паттернов GoF, GRASP не имеют чёткой структуры, а представляют собой обобщённые подходы к проектированию.</p><p><b>Основные:</b> Information Expert, Creator, Controller, Low Coupling, High Cohesion.</p><p><b>Дополнительные:</b> Pure Fabrication, Indirection, Polymorphism, Protected Variations.</p>"
        },
        "information-expert": {
            title: "Информационный эксперт (Information Expert)",
            description: "Ответственность должна быть назначена тому, кто владеет максимумом информации для её исполнения.",
            problem: "Если ответственность назначена неправильному классу, получается запутанный код, где логика размазана по всей системе.",
            solution: "Назначить обязанность классу, который обладает наибольшей информацией для её выполнения.",
            code: "type\n  TOrder = class\n  private\n    FAmount: Double;\n  public\n    property Amount: Double read FAmount;\n  end;\n\n  TCustomer = class\n  private\n    FOrders: TList<TOrder>;\n  public\n    function GetTotalAmount: Double;\n  end;\n\nfunction TCustomer.GetTotalAmount: Double;\nbegin\n  Result := 0;\n  for var Order in FOrders do\n    Result := Result + Order.Amount;\nend;"
        },
        creator: {
            title: "Создатель (Creator)",
            description: "Ответственность за создание объекта ложится на класс, который содержит, агрегирует или использует создаваемые объекты.",
            problem: "Если объекты создаются в неподходящем месте, система становится сильно связанной.",
            solution: "Назначить создание объектов классу, который имеет всю нужную информацию для инициализации.",
            code: "type\n  TOrder = class\n  public\n    constructor Create(AProducts: TList<TOrderProduct>);\n  end;\n\n  TCustomer = class\n  private\n    FOrders: TList<TOrder>;\n  public\n    procedure AddOrder(AProducts: TList<TOrderProduct>);\n  end;\n\nprocedure TCustomer.AddOrder(AProducts: TList<TOrderProduct>);\nbegin\n  FOrders.Add(TOrder.Create(AProducts)); // Customer — создатель Order\nend;"
        },
        controller: {
            title: "Controller",
            description: "Контроллер принимает системные события и делегирует их выполнение другим объектам. Отделяет интерфейс от логики.",
            problem: "Без контроллера логика обработки запросов оказывается размазанной по UI-коду.",
            solution: "Ввести отдельный класс-контроллер, который принимает запрос и решает, кому его передать.",
            code: "type\n  TPatientController = class\n  private\n    FPatientService: TPatientService;\n  public\n    procedure AddPatient(const Name: string);\n    function GetPatient(ID: Integer): TPatient;\n  end;\n\nprocedure TPatientController.AddPatient(const Name: string);\nbegin\n  FPatientService.AddPatient(Name);\nend;"
        },
        "low-coupling": {
            title: "Low Coupling (Слабая связанность)",
            description: "Связи между классами должны быть минимальными. Меньше зависимостей — легче менять код.",
            problem: "Сильная связанность: изменение одного класса тянет за собой изменения во многих других.",
            solution: "Зависеть от абстракций, а не от конкретных классов.",
            code: "type\n  ILogger = interface\n    procedure Log(const Message: string);\n  end;\n\n  TFileLogger = class(TInterfacedObject, ILogger)\n    procedure Log(const Message: string);\n  end;\n\n  TPatientService = class\n  private\n    FLogger: ILogger;\n  public\n    constructor Create(ALogger: ILogger);\n  end;"
        },
        "high-cohesion": {
            title: "High Cohesion (Высокая связность)",
            description: "Класс должен выполнять одну логически целостную задачу. Внутри класса методы должны быть тесно связаны между собой.",
            problem: "Класс с низкой связностью делает слишком много несвязанных вещей, его тяжело понимать и тестировать.",
            solution: "Разделить класс на несколько по функциональному назначению.",
            code: "type\n  // Плохо — класс делает всё\n  TPatientManager = class\n    procedure AddPatient;\n    procedure SendEmail;\n    procedure GenerateReport;\n  end;\n\n  // Хорошо — разделено по обязанностям\n  TPatientRepository = class\n    procedure AddPatient;\n  end;\n\n  TEmailService = class\n    procedure SendEmail;\n  end;\n\n  TReportGenerator = class\n    procedure GenerateReport;\n  end;"
        },
        "pure-fabrication": {
            title: "Pure Fabrication (Чистая выдумка)",
            description: "Искусственно созданный класс-сервис, которого нет в предметной области, но который помогает уменьшить связанность.",
            problem: "Класс предметной области вынужден заниматься инфраструктурой (сохранение в БД, логирование).",
            solution: "Вынести такие задачи в отдельный сервис-класс.",
            code: "type\n  TPatient = class\n  private\n    FName: string;\n    FAge: Integer;\n  end;\n\n  // Сервис, которого нет в предметной области, но нужен для инфраструктуры\n  TPatientRepository = class\n  public\n    procedure Save(Patient: TPatient);\n    function Load(ID: Integer): TPatient;\n  end;"
        },
        indirection: {
            title: "Indirection (Посредник)",
            description: "Ответственность за связь между двумя компонентами возлагается на промежуточный объект, чтобы они не были связаны напрямую.",
            problem: "Прямое взаимодействие компонентов создаёт сильную связанность.",
            solution: "Ввести посредника (mediator, adapter).",
            code: "type\n  IMediator = interface\n    procedure Notify(Sender: TObject; const Event: string);\n  end;\n\n  TPatientController = class\n  private\n    FMediator: IMediator;\n  public\n    procedure AddPatient(const Name: string);\n  end;\n\nprocedure TPatientController.AddPatient(const Name: string);\nbegin\n  FMediator.Notify(Self, 'PatientAdded');\nend;"
        },
        polymorphism: {
            title: "Polymorphism (Полиморфизм)",
            description: "Разные классы могут по-разному реализовать один и тот же метод. Позволяет обрабатывать разные типы единообразно.",
            problem: "Без полиморфизма приходится писать большие if/else по типу объекта.",
            solution: "Определить общий интерфейс/абстрактный класс и переопределять поведение в наследниках.",
            code: "type\n  TShape = class\n    procedure Draw; virtual; abstract;\n  end;\n\n  TCircle = class(TShape)\n    procedure Draw; override;\n  end;\n\n  TSquare = class(TShape)\n    procedure Draw; override;\n  end;\n\nprocedure TCircle.Draw;\nbegin\n  WriteLn('Круг');\nend;\n\nprocedure TSquare.Draw;\nbegin\n  WriteLn('Квадрат');\nend;"
        },
        "protected-variations": {
            title: "Protected Variations (Устойчивость к изменениям)",
            description: "Спроектировать систему так, чтобы изменения в одних элементах не ломали другие. Вокруг точек возможных изменений создаётся стабильный интерфейс.",
            problem: "Изменения требований или технологий ломают работу других частей системы.",
            solution: "Обернуть изменяемые части в абстракции.",
            code: "type\n  IPaymentProcessor = interface\n    procedure Pay(Amount: Double);\n  end;\n\n  TCreditCardProcessor = class(TInterfacedObject, IPaymentProcessor)\n    procedure Pay(Amount: Double);\n  end;\n\n  TPayPalProcessor = class(TInterfacedObject, IPaymentProcessor)\n    procedure Pay(Amount: Double);\n  end;\n\n  TOrderService = class\n  private\n    FPaymentProcessor: IPaymentProcessor;\n  public\n    constructor Create(APaymentProcessor: IPaymentProcessor);\n  end;"
        }
    },

    /*GOF*/
    gof: {
        title: "GoF (Gang of Four)",
        description: "GoF — четыре автора классической книги «Приёмы объектно-ориентированного проектирования. Паттерны проектирования»: Эрих Гамма, Ричард Хелм, Ральф Джонсон и Джон Влиссидес. Они описали 23 паттерна.",
        description_block: {
            title: "Описание GoF",
            content: "<p>Паттерны GoF делятся на три категории:</p><ul><li><b>Порождающие</b> — Singleton, Factory Method, Abstract Factory, Builder, Prototype.</li><li><b>Структурные</b> — Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.</li><li><b>Поведенческие</b> — Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor.</li></ul>"
        },
        patterns: {
            title: "Паттерны",
            description: "Ниже приведены примеры нескольких классических паттернов GoF с реализацией на Delphi.",
            examples: [
                {
                    text: "Singleton (Одиночка) — гарантирует, что класс имеет только один экземпляр, и даёт глобальную точку доступа к нему.",
                    code: "type\n  TSingleton = class\n  private\n    class var FInstance: TSingleton;\n    constructor Create;\n  public\n    class function GetInstance: TSingleton;\n  end;\n\nclass function TSingleton.GetInstance: TSingleton;\nbegin\n  if FInstance = nil then\n    FInstance := TSingleton.Create;\n  Result := FInstance;\nend;"
                },
                {
                    text: "Factory Method (Фабричный метод) — определяет интерфейс для создания объекта, но позволяет наследникам решать, какой класс создавать.",
                    code: "type\n  TProduct = class\n  end;\n\n  TConcreteProduct = class(TProduct)\n  end;\n\n  TCreator = class\n    function CreateProduct: TProduct; virtual; abstract;\n  end;\n\n  TConcreteCreator = class(TCreator)\n    function CreateProduct: TProduct; override;\n  end;\n\nfunction TConcreteCreator.CreateProduct: TProduct;\nbegin\n  Result := TConcreteProduct.Create;\nend;"
                },
                {
                    text: "Observer (Наблюдатель) — объекты подписываются на событие и получают уведомление при его наступлении.",
                    code: "type\n  IObserver = interface\n    procedure Update(const Msg: string);\n  end;\n\n  TSubject = class\n  private\n    FObservers: TList<IObserver>;\n  public\n    procedure Attach(O: IObserver);\n    procedure Notify(const Msg: string);\n  end;\n\nprocedure TSubject.Notify(const Msg: string);\nbegin\n  for var O in FObservers do\n    O.Update(Msg);\nend;"
                }
            ]
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    buildMenu();
    bindMenuClicks();
    bindBrowserNavigation();

    const params = new URLSearchParams(location.search);
    const page = params.get('page') || 'database';
    const sub  = params.get('sub')  || null;

    activateMenu(page, sub);
    loadContent(page, sub);
});


/*МЕНЮ*/
const MENU_STRUCTURE = [
    {
        page: 'database',
        label: 'Database',
        subs: [
            { key: '1nf', label: '1 Нормальная форма' },
            { key: '2nf', label: '2 Нормальная форма' },
            { key: '3nf', label: '3 Нормальная форма' },
            { key: 'bcnf', label: 'Нормальная форма Бойса-Кодда' },
            { key: '4nf', label: '4 Нормальная форма' },
            { key: '5nf', label: '5 Нормальная форма' },
            { key: '6nf', label: '6 Нормальная форма' }
        ]
    },
    {
        page: 'delphi',
        label: 'Delphi',
        subs: [
            { key: 'description_block', label: 'Описание' },
            { key: 'syntax', label: 'Синтаксис и основы языка' }
        ]
    },
    {
        page: 'oop',
        label: 'OOP',
        subs: [
            { key: 'principles', label: 'Основные принципы ООП' },
            { key: 'encapsulation', label: 'Инкапсуляция' },
            { key: 'inheritance', label: 'Наследование' },
            { key: 'polymorphism', label: 'Полиморфизм' },
            { key: 'abstraction', label: 'Абстракция' },
            { key: 'access-modifiers', label: 'Модификаторы доступа' },
            { key: 'friend-class', label: 'Дружественный класс' },
            { key: 'keywords', label: 'Abstract, Virtual, Override, Overload, Interface' }
        ]
    },
    {
        page: 'solid',
        label: 'Solid',
        subs: [
            { key: 'description_block', label: 'Описание' },
            { key: 'srp', label: 'SRP' },
            { key: 'ocp', label: 'OCP' },
            { key: 'lsp', label: 'LSP' },
            { key: 'isp', label: 'ISP' },
            { key: 'dip', label: 'DIP' }
        ]
    },
    {
        page: 'grasp',
        label: 'Grasp',
        subs: [
            { key: 'description_block', label: 'Описание' },
            { key: 'information-expert', label: 'Информационный эксперт' },
            { key: 'creator', label: 'Создатель' },
            { key: 'controller', label: 'Controller' },
            { key: 'low-coupling', label: 'Low Coupling' },
            { key: 'high-cohesion', label: 'High Cohesion' },
            { key: 'pure-fabrication', label: 'Pure Fabrication' },
            { key: 'indirection', label: 'Indirection' },
            { key: 'polymorphism', label: 'Polymorphism' },
            { key: 'protected-variations', label: 'Protected Variations' }
        ]
    },
    {
        page: 'gof',
        label: 'Gof',
        subs: [
            { key: 'description_block', label: 'Описание' },
            { key: 'patterns', label: 'Паттерны' }
        ]
    }
];

function buildMenu() {
    const nav = document.getElementById('sidebar-nav');
    let html = '<ul>';

    MENU_STRUCTURE.forEach(item => {
        html += `<li class="nav-item">`;
        html += `  <a href="#" class="nav-link" data-page="${item.page}">`;
        html += `    <span>${item.label}</span>`;
        html += `    <span class="arrow">▶</span>`;
        html += `  </a>`;
        html += `  <ul class="submenu">`;
        item.subs.forEach(sub => {
            html += `<li><a href="#" data-page="${item.page}" data-sub="${sub.key}">${sub.label}</a></li>`;
        });
        html += `  </ul>`;
        html += `</li>`;
    });

    html += '</ul>';
    nav.innerHTML = html;
}


function bindMenuClicks() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const page = this.dataset.page;
            const submenu = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            document.querySelectorAll('.submenu.open').forEach(sm => {
                if (sm !== submenu) {
                    sm.classList.remove('open');
                    const a = sm.previousElementSibling?.querySelector('.arrow');
                    if (a) a.classList.remove('open');
                }
            });

            if (submenu) {
                const isOpen = submenu.classList.toggle('open');
                if (arrow) arrow.classList.toggle('open', isOpen);
            }

            navigate(page, null);
        });
    });

    document.querySelectorAll('.submenu a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const page = this.dataset.page;
            const sub  = this.dataset.sub;

            if (page && sub) navigate(page, sub);
        });
    });
}

function navigate(page, sub) {
    const url = new URL(location.href);
    url.searchParams.set('page', page);
    if (sub) url.searchParams.set('sub', sub);
    else     url.searchParams.delete('sub');
    history.pushState({ page, sub }, '', url);

    activateMenu(page, sub);
    loadContent(page, sub);
}

function bindBrowserNavigation() {
    window.addEventListener('popstate', () => {
        const params = new URLSearchParams(location.search);
        const page = params.get('page') || 'database';
        const sub  = params.get('sub')  || null;
        activateMenu(page, sub);
        loadContent(page, sub);
    });
}


function activateMenu(page, sub) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.submenu a').forEach(l => l.classList.remove('active-sub'));

    const parent = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (parent) {
        parent.classList.add('active');
        const submenu = parent.nextElementSibling;
        const arrow   = parent.querySelector('.arrow');
        if (submenu) {
            document.querySelectorAll('.submenu.open').forEach(sm => {
                if (sm !== submenu) {
                    sm.classList.remove('open');
                    const a = sm.previousElementSibling?.querySelector('.arrow');
                    if (a) a.classList.remove('open');
                }
            });
            submenu.classList.add('open');
            if (arrow) arrow.classList.add('open');
        }
    }

    if (sub) {
        const link = document.querySelector(`.submenu a[data-page="${page}"][data-sub="${sub}"]`);
        if (link) link.classList.add('active-sub');
    }
}


function loadContent(page, sub) {
    const container = document.getElementById('content-area');
    const data = APP_DATA[page];

    if (!data) {
        container.innerHTML = `<h1>Раздел не найден</h1>`;
        return;
    }

    if (sub && data[sub]) {
        container.innerHTML = renderSection(data[sub]);
    } else {
        container.innerHTML = renderMainPage(page, data);
    }

    container.querySelectorAll('.section-card').forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            const p = card.dataset.page;
            const s = card.dataset.sub;
            if (p && s) navigate(p, s);
        });
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function renderMainPage(page, data) {
    let html = '';

    if (data.title) html += `<h1>${data.title}</h1>`;
    if (data.description) html += `<p>${data.description}</p>`;
    if (data.content) html += `<div>${data.content}</div>`;

    if (data.example_table) {
        html += `<h2>Исходная таблица (до нормализации)</h2>`;
        html += renderTable(data.example_table);
    }

    const subKeys = Object.keys(data).filter(k => {
        const v = data[k];
        return v && typeof v === 'object' && v.title && k !== 'example_table';
    });

    if (subKeys.length) {
        html += `<h2>Разделы</h2>`;
        html += `<div class="section-links">`;
        subKeys.forEach(k => {
            html += `<a href="#" class="section-card" data-page="${page}" data-sub="${k}">${data[k].title}</a>`;
        });
        html += `</div>`;
    }

    return html;
}


function renderSection(section) {
    let html = '';

    if (section.title) html += `<h1>${section.title}</h1>`;
    if (section.description) html += `<p>${section.description}</p>`;
    if (section.problem) html += `<div class="problem"><strong>Проблема:</strong>${section.problem}</div>`;
    if (section.solution) html += `<div class="solution"><strong>Решение:</strong>${section.solution}</div>`;
    if (section.content) html += `<div>${section.content}</div>`;
    if (section.table) html += renderTable(section.table);
    if (section.code) html += renderCode(section.code);

    if (section.examples) {
        section.examples.forEach(ex => {
            if (ex.text) html += `<h3 style="margin-top:18px;color:#2c3e50;">${ex.text}</h3>`;
            if (ex.code) html += renderCode(ex.code);
        });
    }

    return html;
}


function renderTable(t) {
    if (!t || !t.headers || !t.rows) return '';

    let html = '<table><thead><tr>';
    t.headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';

    t.rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => html += `<td>${cell}</td>`);
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

function renderCode(code) {
    return `<div class="code-block"><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

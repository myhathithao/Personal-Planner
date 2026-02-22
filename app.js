/* app.js — Router, navigation, theme switcher, and global init */

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning, lovely! 🌷';
    if (h < 17) return 'Good afternoon, sunshine! ☀️';
    return 'Good evening, beauty! 🌙';
}

function refreshDashboard() {
    renderDashHabits();
    renderDashTodos();
    renderMissedTasks();
    renderWeeklyGoal();
}

function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');
    const navEl = document.getElementById('nav-' + page);
    if (navEl) navEl.classList.add('active');

    if (page === 'dashboard') refreshDashboard();
    if (page === 'habits') { renderHabitGrid(); renderHabitChips(); }
    if (page === 'diary') renderDiaryHistory();
    if (page === 'stats') renderBigGoals();
    if (page === 'ideas') renderIdeas();
}

// ===== THEME SWITCHER =====
const THEMES = ['blossom', 'ocean', 'minimal'];

function applyTheme(theme) {
    document.body.classList.remove(...THEMES.map(t => 'theme-' + t));
    if (theme !== 'blossom') document.body.classList.add('theme-' + theme);
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === theme);
    });
    Storage.set('colorTheme', theme);
}

function initTheme() {
    const saved = Storage.get('colorTheme', 'blossom');
    applyTheme(saved);
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.addEventListener('click', () => applyTheme(dot.dataset.theme));
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Greeting & date
    document.querySelector('.page-title').textContent = getGreeting();
    const dateEl = document.getElementById('dashDate');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    // Sidebar collapse
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    if (Storage.get('sidebarCollapsed', false)) sidebar.classList.add('collapsed');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        Storage.set('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    // Nav links
    document.querySelectorAll('.nav-link, .card-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) navigateTo(page);
        });
    });

    // Modal overlay close on outside click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    });

    // Notification permission (Pomodoro)
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Apply saved theme first
    initTheme();

    // Init all modules
    initQuotes();
    initGoals();
    initCalendar();
    initIdeas();
    initHabits();
    initDiary();
    initStats();
    initPomodoro();
    initReminders();

    // Initial dashboard render
    refreshDashboard();
});

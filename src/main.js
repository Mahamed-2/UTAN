import './style.css'
import gsap from 'gsap'
import * as THREE from 'three'
import en from './locales/en.json'
import sv from './locales/sv.json'

const translations = { en, sv }
let currentLang = 'sv'

function updateContent() {
    const t = translations[currentLang]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n')
        const keys = key.split('.')
        let value = t
        keys.forEach(k => {
            value = value ? value[k] : null
        })
        if (value) {
            if (el.tagName === 'INPUT') {
                el.placeholder = value
            } else {
                el.textContent = value
            }
        }
    })
}

// Language Toggle
function setupLanguageToggle(id) {
    const btn = document.getElementById(id)
    if (!btn) return
    btn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'sv' : 'en'
        updateLanguageButtons()
        updateContent()
        init3DSlogan()
    })
}

function updateLanguageButtons() {
    const btns = ['lang-toggle', 'lang-toggle-mobile']
    btns.forEach(id => {
        const btn = document.getElementById(id)
        if (btn) btn.textContent = currentLang === 'en' ? 'SV' : 'EN'
    })
}

setupLanguageToggle('lang-toggle')
setupLanguageToggle('lang-toggle-mobile')

// Dark Mode Toggle
function setupThemeToggle(id) {
    const btn = document.getElementById(id)
    if (!btn) return
    btn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme')
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        updateTheme(newTheme)
    })
}

function updateTheme(newTheme) {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    const btns = ['theme-toggle', 'theme-toggle-mobile']
    btns.forEach(id => {
        const btn = document.getElementById(id)
        if (btn) btn.textContent = newTheme === 'dark' ? '☀️' : '🌙'
    })
}

setupThemeToggle('theme-toggle')
setupThemeToggle('theme-toggle-mobile')

// Initial theme/lang sync
const savedTheme = localStorage.getItem('theme') || 'light'
updateTheme(savedTheme)
updateLanguageButtons()

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle')
    const navLinks = document.getElementById('nav-links')
    const links = navLinks.querySelectorAll('a')

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active')
        menuToggle.classList.toggle('active')
        document.body.classList.toggle('no-scroll')
    })

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active')
            menuToggle.classList.remove('active')
            document.body.classList.remove('no-scroll')
        })
    })
}

// 3D Slogan Animation using JS (Subtle Tilt)
function init3DSlogan() {
    const slogan = document.getElementById('slogan-3d')

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window

        const xPos = (clientX / innerWidth - 0.5) * 20
        const yPos = (clientY / innerHeight - 0.5) * -20

        gsap.to(slogan, {
            duration: 0.5,
            rotateY: xPos,
            rotateX: yPos,
            ease: 'power2.out'
        })
    })
}

// Fade Animations
function initAnimations() {
    gsap.from('.hero-text > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    })

    gsap.from('.hero-visual', {
        x: 50,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: 'power3.out'
    })
}

// Waitlist Form Handling
function initWaitlist() {
    const form = document.getElementById('waitlist-form');
    const successMsg = document.getElementById('waitlist-success');
    const privacyText = document.querySelector('.cta-privacy');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button');
        const originalBtnText = submitBtn.textContent;
        const email = form.querySelector('input[name="email"]').value;

        // Change button to loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining...';

        try {
            // Updated to use URLSearchParams for better compatibility with no-cors Apps Script
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxijopT7wHSVYy4krIURX599ZqRQPTqDBiz5VTwKfCJSC8g5Xj9EzaLrr8qyrLwJ_Oy/exec';

            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('timestamp', new Date().toISOString());

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });

            // Show success message
            form.classList.add('hidden');
            if (privacyText) privacyText.classList.add('hidden');
            successMsg.classList.remove('hidden');

        } catch (error) {
            console.error('Waitlist Error:', error);
            alert('Something went wrong. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    updateContent()
    init3DSlogan()
    initAnimations()
    initWaitlist()
    initMobileMenu()
})

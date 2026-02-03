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
const langBtn = document.getElementById('lang-toggle')
langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'sv' : 'en'
    langBtn.textContent = currentLang === 'en' ? 'SV' : 'EN'
    updateContent()
    init3DSlogan() // Re-init to handle text change if needed
})

// Dark Mode Toggle
const themeBtn = document.getElementById('theme-toggle')
const currentTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', currentTheme)
themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙'

themeBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme')
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙'
})

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
            // Replace with your Google Apps Script URL
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygSGOp2JFHxoRvC5xhpLDwVKyP7E2LrsRQobQbruM0GoFxDGeviLR5B6Nw-MfqId8v/exec';

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Apps Script requires no-cors for Simple Triggers
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, timestamp: new Date().toISOString() })
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
})

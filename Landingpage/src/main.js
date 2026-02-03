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

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    updateContent()
    init3DSlogan()
    initAnimations()
})

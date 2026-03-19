const MantisApp = {
    init() {
        this.initMobileNav();
        this.initScrollAnimations();
        this.initHeaderScroll();
        this.initCalculators();
        this.initDectalk();
    },

    initMobileNav() {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');
        if (!hamburger || !mobileNav) return;
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && e.target !== hamburger) {
                mobileNav.classList.remove('active');
            }
        });
    },

    initHeaderScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    },

    initScrollAnimations() {
        const wrappers = document.querySelectorAll('.sticky-wrapper');
        if (wrappers.length === 0) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const content = entry.target.querySelector('.sticky-content');
                if (content) content.classList.toggle('active', entry.isIntersecting);
            });
        }, { threshold: 0.2 });
        wrappers.forEach(wrapper => observer.observe(wrapper));
    },

    initCalculators() {
        const bandwidthInputs = ['width', 'height', 'refreshRate', 'colorDepth', 'hdr'];
        bandwidthInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
                el.addEventListener(eventType, this.debounce(() => calculateBandwidth(), 300));
            }
        });
    },

    initDectalk() {
        const loadBtn = document.getElementById('loaddectalk');
        if (!loadBtn) return;

        loadBtn.addEventListener('click', () => {
            const container = document.getElementById('dectalk-container');
            const iframe = document.getElementById('dectalk-iframe');
            
            if (container) container.style.display = 'block';
            loadBtn.innerText = "INITIALIZING...";
            loadBtn.style.pointerEvents = "none";
            
            if (iframe) {
                iframe.src = "dectalksynth.html";
            }
        });
    },

    debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }
};


function appendToDisplay(value) {
    const el = document.getElementById('standard-calc-display');
    if (el) el.value += value;
}

function clearDisplay() {
    const el = document.getElementById('standard-calc-display');
    if (el) el.value = '';
}

function calculate() {
    const display = document.getElementById('standard-calc-display');
    try {
        let expression = display.value
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/sqrt\((.*?)\)/g, 'Math.sqrt($1)')
            .replace(/pow\(([^,]+),([^)]+)\)/g, 'Math.pow($1,$2)')
            .replace(/sin\(([^)]+)\)/g, 'Math.sin($1 * Math.PI / 180)')
            .replace(/cos\(([^)]+)\)/g, 'Math.cos($1 * Math.PI / 180)')
            .replace(/tan\(([^)]+)\)/g, 'Math.tan($1 * Math.PI / 180)');
        
        if (/[^0-9+\-*/().\sMathsqrtpowsincoStanPI]/.test(expression)) throw new Error('Invalid');
        const result = Function(`return ${expression}`)();
        display.value = isFinite(result) ? result : 'Error';
    } catch (e) {
        display.value = 'Error';
    }
}

function calculateBandwidth() {
    const getVal = (id) => parseInt(document.getElementById(id)?.value);
    const width = getVal('width'), height = getVal('height'), refresh = getVal('refreshRate'), depth = getVal('colorDepth');
    const hdr = document.getElementById('hdr')?.value;
    const result = document.getElementById('result');

    if (!width || !height || !refresh || !depth || !result) return;

    let bps = (width * 1.04) * (height * 1.02) * refresh * (depth * 3);
    if (hdr === 'yes') bps *= 1.1;

    const gbps = (bps / 1e9).toFixed(2);
    result.innerHTML = `${gbps} Gbps<br><span style="color:rgba(0,209,255,0.6); font-size:12px;">DSC: ${(gbps/3).toFixed(2)} Gbps</span>`;
}

function calculatePercentChange() {
    const initial = parseFloat(document.getElementById('initialValue').value);
    const final = parseFloat(document.getElementById('finalValue').value);
    const display = document.getElementById('percent-display');

    if (!isNaN(initial) && !isNaN(final)) {
        if (initial === 0) {
            display.innerText = "Error: V1 is 0";
            display.style.color = "rgb(255, 0, 43)";
            return;
        }

        const change = ((final - initial) / Math.abs(initial)) * 100;
        const formattedChange = change.toFixed(2);

        display.innerText = (change > 0 ? "+" : "") + formattedChange + "%";

        if (change > 0) {
            display.style.color = "rgb(0, 255, 136)";
            display.style.textShadow = "0 0 15px rgba(0, 255, 136, 0.5)";
        } else if (change < 0) {
            display.style.color = "rgb(255, 0, 43)";
            display.style.textShadow = "0 0 15px rgba(255, 0, 43, 0.5)";
        } else {
            display.style.color = "rgb(0, 209, 255)";
        }

    } else {
        display.innerText = "Invalid Input";
        display.style.color = "rgb(255, 0, 43)";
    }
}

function calculatePercentDifference() {
    const v1 = parseFloat(document.getElementById('value1').value);
    const v2 = parseFloat(document.getElementById('value2').value);
    const display = document.getElementById('diff-display');

    if (!isNaN(v1) && !isNaN(v2)) {
        if (v1 === 0 && v2 === 0) {
            display.innerText = "0.00%";
            display.style.color = "rgb(0, 209, 255)";
            return;
        }

        const difference = Math.abs(v1 - v2);
        const average = (v1 + v2) / 2;
        const percentDiff = (difference / average) * 100;

        display.innerText = percentDiff.toFixed(2) + "%";
        
        display.style.color = "rgb(0, 209, 255)";
        display.style.textShadow = "0 0 15px rgba(0, 209, 255, 0.5)";
    } else {
        display.innerText = "Invalid Input";
        display.style.color = "rgb(255, 0, 43)";
    }
}

document.querySelectorAll('.copy-song').forEach(button => {
    button.addEventListener('click', () => {
        const phonemes = button.getAttribute('data-phonemes');
        
        navigator.clipboard.writeText(phonemes).then(() => {
            const originalText = button.innerText;
            button.innerText = "COPIED TO CLIPBOARD!";
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.innerText = originalText;
                button.classList.remove('btn-success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert("Security block: Please ensure you are using HTTPS or localhost to use the clipboard.");
        });
    });
});

document.addEventListener('DOMContentLoaded', () => MantisApp.init());
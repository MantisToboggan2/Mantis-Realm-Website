/* Drop down menu */
const hamburger=document.getElementById('hamburger');
const mobileNav=document.getElementById('mobile-nav');
hamburger.addEventListener('click',e=>{
e.stopPropagation();
mobileNav.classList.toggle('active');
hamburger.style.visibility=mobileNav.classList.contains('active')?'hidden':'visible';
});
document.addEventListener('click',e=>{
if(mobileNav.classList.contains('active')&&!mobileNav.contains(e.target)){
mobileNav.classList.remove('active');
hamburger.style.visibility='visible';
}
});


/* Footer */
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  let footer = document.querySelector('footer');

  if (currentScroll > lastScrollTop && currentScroll > 100) {
    footer.classList.add('visible');
  } else {
    footer.classList.remove('visible');
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

/* Standard Calculator */
function appendToDisplay(value) {
  document.getElementById('standard-calc-display').value += value;
}

function clearDisplay() {
  document.getElementById('standard-calc-display').value = '';
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
    if (/[^0-9+\-*/().\sMathsqrtpowsincoStanPI]/.test(expression)) {
      throw new Error('Invalid characters');
    }
    const result = Function(`return ${expression}`)();
    if (!isFinite(result)) {
      throw new Error('Invalid result');
    }
    display.value = result;
  } catch (error) {
    console.error('Calculation error:', error.message);
    display.value = 'Error';
  }
}

/* Display Bandwidth Calculator */
function calculateBandwidth() {
  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);
  const refreshRate = parseInt(document.getElementById('refreshRate').value);
  const colorDepth = parseInt(document.getElementById('colorDepth').value);
  const hdr = document.getElementById('hdr').value;
  const result = document.getElementById('result');
  if (!width || !height || !refreshRate || !colorDepth) {
    result.innerHTML = 'Please fill in all fields.';
    return;
  }
  const hBlank = Math.round(width * 0.04);
  const vBlank = Math.round(height * 0.02);
  const totalWidth = width + hBlank;
  const totalHeight = height + vBlank;
  const totalPixels = totalWidth * totalHeight;
  const bitsPerPixel = colorDepth * 3;
  let bandwidthBps = totalPixels * refreshRate * bitsPerPixel;
  if (hdr === 'yes') {
    bandwidthBps *= 1.1;
  }
  const bandwidthGbps = (bandwidthBps / 1_000_000_000).toFixed(2);
  const bandwidthGbpsDSC = (bandwidthBps / 3 / 1_000_000_000).toFixed(2);
  result.innerHTML = `${bandwidthGbps} Gbps<br>DSC: ${bandwidthGbpsDSC} Gbps`;
}

/* Percent Change Calculator */
function calculatePercentChange() {
  const initialValue = parseFloat(document.getElementById('initialValue').value);
  const finalValue = parseFloat(document.getElementById('finalValue').value);
  const errorResult = document.getElementById('error-result');
  const pchangeResult = document.getElementById('pchange-result');
  errorResult.textContent = '';
  pchangeResult.textContent = 'Result: --%';
  if (isNaN(initialValue) || isNaN(finalValue)) {
    errorResult.textContent = 'Please enter valid numbers.';
    return;
  }
  if (initialValue === 0) {
    errorResult.textContent = 'Initial value cannot be zero.';
    return;
  }
  const change = finalValue - initialValue;
  const percentChange = (change / initialValue) * 100;
  pchangeResult.textContent = `Result: ${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`;
}

/* Percent Difference Calculator */
function calculatePercentDifference() {
  const value1 = parseFloat(document.getElementById('value1').value);
  const value2 = parseFloat(document.getElementById('value2').value);
  const result = document.getElementById('result');
  if (isNaN(value1) || isNaN(value2)) {
    result.innerHTML = 'Please input a number into both boxes!';
    return;
  }
  const difference = Math.abs(value1 - value2);
  const average = (value1 + value2) / 2;
  if (average === 0) {
    result.innerHTML = 'Average of values cannot be zero.';
    return;
  }
  const percentDifference = (difference / average) * 100;
  result.innerHTML = `The difference between these two numbers is ${percentDifference.toFixed(2)}%`;
}

/* Initialize Calculators */
document.addEventListener('DOMContentLoaded', () => {
  const calcButton = document.querySelector('.calculator-section .calculator button');
  if (calcButton && document.getElementById('result')) {
    calcButton.addEventListener('click', calculateBandwidth);
  }
  const inputs = ['width', 'height', 'refreshRate', 'colorDepth'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', debounce(calculateBandwidth, 300));
    }
  });
  const hdr = document.getElementById('hdr');
  if (hdr) {
    hdr.addEventListener('change', calculateBandwidth);
  }
});

/* Debounce Utility */
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

/* Defer Dectalk page loading becuase its very large */
document.getElementById('loaddectalk').addEventListener('click', function() {
  const container = document.getElementById('dectalk-container');
  container.style.display = 'block';

  const script = document.createElement("script");
  script.src = "epsonapi.js";
  document.body.appendChild(script);
});
export function startLoader() {
    let element = document.getElementById('loader-bg');
    element.style.display = 'block';
}

export function stopLoader() {
    let element = document.getElementById('loader-bg');
    element.style.display = 'none';
}
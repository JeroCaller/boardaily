export function insertFooterHTML() {
    const footer = document.querySelector('footer');

    footer.insertAdjacentHTML('beforeend', 
    `<div id="copyright">
        <p>© 2024 JeroCaller.</p>
    </div>
    <div id="follow">
        <small>Follow</small>
        <div id="icons">
            <a href="https://github.com/JeroCaller/boardaily" target=”_black”>
                <i class="fa-brands fa-square-github"></i>
            </a>
        </div>
    </div>`
    );
}

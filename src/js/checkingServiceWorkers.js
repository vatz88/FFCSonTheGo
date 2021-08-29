if ('serviceWorker' in window.navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        window.navigator.serviceWorker
            .register(`${window.location.origin}/sw.js`)
            .then((reg) => {
                setInterval(() => {
                    reg.update();
                }, 10 * 60 * 1000);
            });
    });
    window.navigator.serviceWorker.addEventListener(
        'controllerchange',
        function() {
            var result = window.confirm(
                'A new version available! Do you want to reload?',
            );
            if (result) {
                window.location.reload();
            }
        },
    );
}
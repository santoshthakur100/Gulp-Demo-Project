requirejs.config({
    baseUrl: "scripts",
    paths: {
        jquery: 'lib/jquery.min',
        modernizr: 'lib/modernizr',
        bootstrap: 'lib/bootstrap.min', 
        isMobile: 'lib/isMobile',
        isScreensize: 'lib/isScreensize', 
        matchHeight: 'lib/matchHeight',
        owlCarousel: 'lib/owl.carousel.min',
        actual: 'lib/jquery.actual',
        components: 'components'
    },
    shim: {
        'bootstrap': ['jquery'],
        'isMobile': ['jquery'],
        'isScreensize': ['jquery'],
        'owlCarousel': ['jquery'],
        'matchHeight': ['jquery']
    }
});

requirejs(['jquery', 'modernizr', 'bootstrap', 'isMobile', 'isScreensize', 'owlCarousel', 'matchHeight', 'actual']);
requirejs(['components']);
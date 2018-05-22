var Twig = Twig || requireUncached("../twig"),
    twig = twig || Twig.twig;

Twig.cache(false);

describe("Twig.js Embed ->", function() {
    // Test loading a template from a remote endpoint
    it("it should load embed and render", function() {
        twig({
            id:   'embed',
            path: 'test/templates/embed-simple.twig',
            async: false
        });
        // Load the template
        twig({ref: 'embed'}).render({ }).trim().should.equal( ['START',
                                                               'A',
                                                               'new header',
                                                               'base footer',
                                                               'B',
                                                               '',
                                                               'A',
                                                               'base header',
                                                               'base footer',
                                                               'extended',
                                                               'B',
                                                               '',
                                                               'A',
                                                               'base header',
                                                               'extended',
                                                               'base footer',
                                                               'extended',
                                                               'B',
                                                               '',
                                                               'A',
                                                               'Super cool new header',
                                                               'Cool footer',
                                                               'B',
                                                               'END'].join('\n') );
    });

    it("should skip an non existant embed flagged wth 'ignore missing'", function() {
        twig({
            id:   'embed-ignore-missing',
            path: 'test/templates/embed-ignore-missing.twig',
            async: false
        });

        twig({ref: 'embed-ignore-missing'}).render().should.equal( "ignore-missing" );
    });

    it('should support complex nested embeds', function () {
        twig({
            data: '<{% block header %}outer-header{% endblock %}><{% block footer %}outer-footer{% endblock %}>',
            id: 'embed-outer.twig'
        });
        twig({
            data: '{% block content %}inner-content{% endblock %}',
            id: 'embed-inner.twig'
        });

        twig({
            allowInlineIncludes: true,
            data: '{% embed "embed-outer.twig" %}{% block header %}{% embed "embed-inner.twig" %}{% block content %}override-header{% endblock %}{% endembed %}{% endblock %}{% block footer %}{% embed "embed-inner.twig" %}{% block content %}override-footer{% endblock %}{% endembed %}{% endblock %}{% endembed %}'
        }).render().should.equal('<override-header><override-footer>');
    });

    it('should support multiple inheritance and embeds', function () {
        twig({
            data: '<{% block header %}base-header{% endblock %}>{% block body %}<base-body>{% endblock %}<{% block footer %}base-footer{% endblock %}>',
            id: 'base.twig'
        });
        twig({
            data: '{% extends "base.twig" %}{% block header %}layout-header{% endblock %}{% block body %}<{% block body_header %}layout-body-header{% endblock %}>{% block body_content %}layout-body-content{% endblock %}<{% block body_footer %}layout-body-footer{% endblock %}>{% endblock %}',
            id: 'layout.twig'
        });
        twig({
            data: '<{% block section_title %}section-title{% endblock %}><{% block section_content %}section-content{% endblock %}>',
            id: 'section.twig'
        });

        twig({
            allowInlineIncludes: true,
            data: '{% extends "layout.twig" %}{% block body_header %}override-body-header{% endblock %}{% block body_content %}{% embed "section.twig" %}{% block section_content %}override-section-content{% endblock %}{% endembed %}{% endblock %}'
        }).render().should.equal('<layout-header><override-body-header><section-title><override-section-content><layout-body-footer><base-footer>');
    });
});
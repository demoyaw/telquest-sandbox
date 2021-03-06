define('ProductDetails.Base.View.Tags', [
    'ProductDetails.Base.View',
    'SC.Configuration',
    'FakeLogin.Utils',
    'jQuery',
    'Utils',
    'underscore'
], function ProductDetailsBaseViewTags(
    ProductDetailsBaseView,
    Configuration,
    FakeLoginUtils,
    jQuery,
    Utils,
    _
) {
    'use strict';

    /* function to cut only full words */
    function textCutter(text, n) {
        var short = text.substr(0, n);
        if (/^\S/.test(text.substr(n))) {
            return short.replace(/\s+\S*$/, '');
        }
        return short;
    }


    _.extend(ProductDetailsBaseView.prototype, {
        events: _.extend(ProductDetailsBaseView.prototype.events || {}, {
            'click [data-target="fakeLogin"]': 'fakeLogin'
        }),

        fakeLogin: function fakeLogin(e) {
            e.preventDefault();
            e.stopPropagation();
            FakeLoginUtils.addFakeLogin();
        },

        getMetaDescription: function getMetaDescription() {
            var metaDescription = this.getMetaTags().filter('[name="description"]').attr('content') || this.model.get('metataghtml') || '';
            if (metaDescription === '') {
                metaDescription = this.model.get('item').get('storedetaileddescription').replace(/<(?:.|\n)*?>/gm, '')
                    || this.model.get('item').get('featureddescription').replace(/<(?:.|\n)*?>/gm, '');
            }
            return textCutter(metaDescription, 156);
        },
        getTitle: _.wrap(ProductDetailsBaseView.prototype.getTitle, function wrapProductDetailsBaseView(fn) {
            var originalResult = (fn.apply(this, _.toArray(arguments).slice(1)));
            // add site name to SEO tag
            if (originalResult.indexOf(Configuration.get('defaultSiteSearchName')) < 0) {
                originalResult = Configuration.get('defaultSiteSearchName') ?
                    Configuration.get('defaultSiteSearchName') + ' ' + originalResult : originalResult;
            }
            return textCutter(originalResult, 156);
        }),

        getContext: _.wrap(ProductDetailsBaseView.prototype.getContext, function getContext(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1));
            _.extend(context, {
                isLoggedIn: FakeLoginUtils.isLoggedIn()
            });
            return context;
        })
    });
});


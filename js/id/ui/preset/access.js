iD.ui.preset.access = function(field, context) {
    var event = d3.dispatch('change'),
        entity,
        items;

    function access(selection) {
        var wrap = selection.selectAll('.preset-input-wrap')
            .data([0]);

        wrap.enter().append('div')
            .attr('class', 'cf preset-input-wrap')
            .append('ul');

        items = wrap.select('ul').selectAll('li')
            .data(field.keys);

        // Enter

        var enter = items.enter().append('li')
            .attr('class', function(d) { return 'cf preset-access-' + d; });

        enter.append('span')
            .attr('class', 'col6 label preset-label-access')
            .attr('for', function(d) { return 'preset-input-access-' + d; })
            .text(function(d) { return field.t('types.' + d); });

        enter.append('div')
            .attr('class', 'col6 preset-input-access-wrap')
            .append('input')
            .attr('type', 'text')
            .attr('class', 'preset-input-access')
            .attr('id', function(d) { return 'preset-input-access-' + d; })
            .each(function(d) {
                d3.select(this)
                    .call(d3.combobox()
                        .data(access.options(d)));
            });

        // Update

        wrap.selectAll('.preset-input-access')
            .on('change', change)
            .on('blur', change);
    }

    function change(d) {
        var tag = {};
        tag[d] = d3.select(this).value() || undefined;
        event.change(tag);
    }

    access.options = function(type) {
        var options = ['no', 'permissive', 'private', 'designated', 'destination'];

        if (type != 'access') {
            options.unshift('yes');
        }

        return options.map(function(option) {
            return {
                title: field.t('options.' + option + '.description'),
                value: option
            };
        });
    };

    access.entity = function(_) {
        if (!arguments.length) return entity;
        entity = _;
        return access;
    };

    access.tags = function(tags) {
        items.selectAll('.preset-input-access')
            .value(function(d) { return tags[d] || ''; })
            .attr('placeholder', function(d) {
                return d !== 'access' && tags.access ? tags.access : field.placeholder();
            });
    };

    access.focus = function() {
        items.selectAll('.preset-input-access')
            .node().focus();
    };

    return d3.rebind(access, event, 'on');
};

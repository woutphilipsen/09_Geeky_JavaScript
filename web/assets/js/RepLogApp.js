'use strict';

(function(window, $) {
    window.RepLogApp = function($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);

        // ATTACH LISTENERS TO DOM ELEMENTS WITH DELEGATE SELECTORS FTW
        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRowClick.bind(this)
        );

        this.$wrapper.on(
            'submit',
            '.js-new-rep-log-form',
            this.handleNewFormSubmit.bind(this)
        );
    };

    $.extend(window.RepLogApp.prototype, {

        updateTotalWeightLifted: function() {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },

        handleRepLogDelete: function(e) {
            e.preventDefault();

            var $link = $(e.currentTarget);
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');
            var self = this;

            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function () {
                    $row.fadeOut('normal', function() {
                        $(this).remove();
                        self.updateTotalWeightLifted();
                    });
                }
            })
        },

        handleRowClick: function() {
            console.log('Row clicked');
        },

        handleNewFormSubmit: function(e) {
            e.preventDefault();

            var $form = $(e.currentTarget);
            var formData = {};
            $.each($form.serializeArray(), function(key, fieldData) {
                formData[fieldData.name] = fieldData.value;
            });
            $.ajax({
                url: $form.data('url'),
                method: 'POST',
                data: JSON.stringify(formData),
                success: function(data) {
                    // TODO
                    console.log('success');
                },
                error: function(jqXHR) {
                    console.log('error :(');
                }
            });
        }

    });

    /**
     * A "private" object
     */
    // in this case the function is the object
    var Helper = function($wrapper) {
            this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {

        calculateTotalWeight: function () {
            var totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight');
            });

            return totalWeight;
        }
    });
})(window, jQuery);
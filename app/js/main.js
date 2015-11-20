var kaminario = kaminario || {};
kaminario.main = (kaminario.main || (function () {
  "use strict";
  var container = $('.container'),
          isItEditMode = false,
          /**
           * public method object
           * @type {{}}
           */
          pub = {};

  pub.init = function () {
    init_table_event();
  };

  pub.open_modal_with_data = function (firstName, lastName, email, age) {
    $('#myModal')
            .find('[name="firstname"]').val(firstName).end()
            .find('[name="lastname"]').val(lastName).end()
            .find('[name="email"]').val(email).end()
            .find('[name="age"]').val(age).end();
  };


  function init_table_event() {
    $('.btn,input[type="checkbox"]').on('click', function () {
      var $ele = $(this);

      var eventKey = $ele.data('event-name');
      var event = $.Event('scope.event.' + eventKey);
      $ele.trigger(event, [$ele, $(this)]);
    });

    container.on('scope.event.add', function () {
      isItEditMode = false;
    });

    /**
     * edit event
     */
    container.on('scope.event.edit', function (e, elem) {
      pub.reset_form_value();
      isItEditMode = true;
      var row = pub.getSelectedRows();
      pub.open_modal_with_data(row.find('[data-firstname]').html(), row.find('[data-lastname]').html(), row.find('[data-email]').html(), row.find('[data-age]').html());
      return elem;
    });

    /**
     * remove Selected Row on delete event
     */
    container.on('scope.event.delete', function () {
      pub.getSelectedRows().remove();
    });

    /**
     * select single row element event
     */
    container.on('scope.event.select', function () {
     check_for_edit_button();
    });

    /**
     * save/update selected row or add new one
     */
    container.on('scope.event.addOrUpdate', function () {
      var formValues = pub.get_form_value();
      if (isItEditMode) {
        formValues.each(function (d, obj) {
          var $selectedRow = pub.getSelectedRows();
          $selectedRow.find('[data-' + obj.input_key + ']').html(obj.value);
        });
      } else {
        $('.table-responsive tbody').append(pub.add_new_row(formValues));
      }
      pub.reset_form_value();
      $('#myModal').modal('toggle');
    });

    /**
     * select all rows element event
     */
    container.on('scope.event.selectAll', function (e, elem) {
      var check_all = elem.prop("checked");
      $('input:checkbox').prop('checked', check_all);
      check_for_edit_button()
      return elem;
    });


  }

  /**
   * private method
   *
   * checking if the edit button should be disabled
   */
  function check_for_edit_button(){
    var number_selected_row =  pub.getSelectedRows().length;
    (number_selected_row === 1) ?   $('.btn[data-event-name="edit"]').removeClass('disabled') :$('.btn[data-event-name="edit"]').addClass('disabled');
  };

  /**
   * add new Row
   * @returns the new Row
   */
  pub.add_new_row = function (data) {
     var row_data  = $.map(data,function(d){
       return {key: d.input_key,val: d.value}
     });

    var tmpl = '\
             <tr>\
                <td><input data-event-name="select" type="checkbox"/></td>\
                {{#row_data}}\
                    <td data-{{key}}>{{val}}</td>\
                {{/row_data}}\
             </tr>';
    return Mustache.render(tmpl, {row_data:row_data});
  };


  /**
   * return the tr row by the checkbox
   * @returns {*|jQuery}
   */
  pub.getSelectedRows = function () {
    return $("input[type=checkbox]:checked").parent().closest('tr');
  }

  /**
   * return object with the form value
   */
  pub.get_form_value = function () {
    return $('#myModal .modal-body input[name]').map(function (i, el) {
      return {
        input_key: $(el).attr('name'),
        value: $(el).val()
      }
    });
  };

  /**
   * reset modal inputs value
   */
  pub.reset_form_value = function () {
    $('#myModal .modal-body input[name]').each(function (i, el) {
      $(el).val("");
    })
  };
  /**
   * expose the public method to the world
   */
  return pub;

})())


$(function () {
  kaminario.main.init();
});
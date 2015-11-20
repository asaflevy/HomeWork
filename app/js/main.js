var kaminario = kaminario || {};

/**
 * main kaminario module
 */
kaminario.main = (kaminario.main || (function () {
  "use strict";
  var container = $('.container'),
          cookieHelper,
          /**
           * tracking variable in order to know if it's add or update row
           * @type {boolean}
           */
          isItEditMode = false,
          /**
           * public method object
           * @type {{}}
           */
          pub = {};

  pub.init = function () {
    cookieHelper = new CookieHelper('kaminario_data');
    init_table_event_listeners();
    pub.generate_rows_from_coockie();
  };

  pub.generate_rows_from_coockie = function () {
    var data = cookieHelper.read()
    for (var i = 0; i < data.length; i++) {
      var row_data  = [{input_key: 'firstname', value: data[i]['firstname']},
        {input_key: 'lastname', value: data[i]['lastname']},
        {input_key: 'age', value: data[i]['age']},
        {input_key: 'email', value: data[i]['email']}]
      $('.table-responsive tbody').append(get_new_row(row_data));
    }
  };


  /**
   * init all the event listeners on the puge
   */
  function init_table_event_listeners() {

    /**
     * trigger custom event when action happens
     */
    container.on('click','.btn,input[type="checkbox"]', function () {
      var $ele = $(this);
      var eventKey = $ele.data('event-name');
      var event = $.Event('scope.event.' + eventKey);
      $ele.trigger(event, [ $(this),function(){
        cookieHelper.save(get_all_data_from_table());
      }]);
    });

    container.on('scope.event.add', function () {
      isItEditMode = false;
      pub.reset_form_value();
    });


    /**
     * edit event
     * returning the element for future chaining
     */
    container.on('scope.event.edit', function (e, elem) {
      pub.reset_form_value();
      isItEditMode = true;
      var row = pub.get_selected_rows();
      var rowDataObject = get_data_from_table_row($(row));
      pub.open_modal_with_data(rowDataObject.firstname, rowDataObject.lastname, rowDataObject.email, rowDataObject.age);
      return elem;
    });

    /**
     * remove Selected Row on delete event
     * returning the element for future chaining
     */
    container.on('scope.event.delete', function (e, elem,callback) {
      pub.get_selected_rows().remove();
      if($.isFunction(callback)) {
        callback();
      }

      return elem;
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
    container.on('scope.event.addOrUpdate', function (e, elem,callback) {
      var formValues = pub.get_form_value();
      if (isItEditMode) {
        $.each(formValues,function (d, obj) {
          var $selectedRow = pub.get_selected_rows();
          $selectedRow.find('[data-' + obj.input_key + ']').html(obj.value);
        });
      } else {
        $('.table-responsive tbody').append(get_new_row(formValues));
      }
      callback();
      pub.reset_form_value();
      $('#myModal').modal('toggle');
      return elem;
    });

    /**
     * select all rows element event
     */
    container.on('scope.event.selectAll', function (e, elem) {
      var check_all = elem.prop("checked");
      $('input:checkbox').prop('checked', check_all);
      check_for_edit_button();
      return elem;
    });


  }



  /**
   * open the popup modal with specific data
   * @param firstName
   * @param lastName
   * @param email
   * @param age
   */
  pub.open_modal_with_data = function (firstName, lastName, email, age) {
    $('#myModal')
            .find('[name="firstname"]').val(firstName).end()
            .find('[name="lastname"]').val(lastName).end()
            .find('[name="email"]').val(email).end()
            .find('[name="age"]').val(age).end();
  };


  /**
   * return the tr row by the checkbox
   * @returns {*|jQuery}
   */
  pub.get_selected_rows = function () {
    return $("input[type=checkbox]:checked").parent().closest('tr');
  };

  /**
   * return object with the form value
   */
  pub.get_form_value = function () {
    return $.map($('#myModal .modal-body input[name]'), function (el) {
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
   * private method
   *
   * checking if the edit button should be disabled
   */
  function check_for_edit_button() {
    var number_selected_row = pub.get_selected_rows().length;
    (number_selected_row === 1) ? $('.btn[data-event-name="edit"]').removeClass('disabled') : $('.btn[data-event-name="edit"]').addClass('disabled');
  };

  /**
   * add new Row
   * @returns the new Row
   */
  function get_new_row  (row_data) {

    var tmpl = '\
             <tr>\
                <td><input data-event-name="select" type="checkbox"/></td>\
                {{#row_data}}\
                    <td data-{{input_key}}>{{value}}</td>\
                {{/row_data}}\
             </tr>';
    return Mustache.render(tmpl, {row_data: row_data});
  };

  /**
   * retrieve array of form data
   * private method;
   */
  function get_all_data_from_table() {
    return $.map($('.table-responsive tbody tr'), function (d) {
      return get_data_from_table_row($(d));
    });
  }

  /**
   * return table row data as object
   * @param $row
   * @returns {*}
   */
  function get_data_from_table_row($row) {
    return {
      firstname: $row.find('[data-firstname]').html(),
      lastname: $row.find('[data-lastname]').html(),
      email: $row.find('[data-email]').html(),
      age: $row.find('[data-age]').html()
    }
  }



  /**
   * expose the public method to the world
   */
  return pub;

})())


$(function () {
  kaminario.main.init();
});
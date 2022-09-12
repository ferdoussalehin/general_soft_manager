$(document).ready(function(){
   /*__purchase.js is linked in head.php__*/
    // <script src="<?php echo base_url() ?>assets/admin/js/purchase.js"> </script>

    // clear localStorage and reload
    $('#reset').click(function (e) {
        
        if (protect_delete == 1) {
            var boxd = bootbox.dialog({
                title: "<i class='fa fa-key'></i> Pin Code",
                message: '<input id="pos_pin" name="pos_pin" type="password" placeholder="Pin Code" class="form-control"> ',
                buttons: {
                    success: {
                        label: "<i class='fa fa-tick'></i> OK",
                        className: 'btn-success verify_pin',
                        callback: function () {
                            var pos_pin = md5($('#pos_pin').val());
                            if (pos_pin == pos_settings.pin_code) {
                                if (localStorage.getItem('positems')) {
                                    localStorage.removeItem('positems');
                                }
                                if (localStorage.getItem('posdiscount')) {
                                    localStorage.removeItem('posdiscount');
                                }
                                if (localStorage.getItem('postax2')) {
                                    localStorage.removeItem('postax2');
                                }
                                if (localStorage.getItem('posshipping')) {
                                    localStorage.removeItem('posshipping');
                                }
                                if (localStorage.getItem('posref')) {
                                    localStorage.removeItem('posref');
                                }
                                if (localStorage.getItem('poswarehouse')) {
                                    localStorage.removeItem('poswarehouse');
                                }
                                if (localStorage.getItem('posnote')) {
                                    localStorage.removeItem('posnote');
                                }
                                if (localStorage.getItem('posinnote')) {
                                    localStorage.removeItem('posinnote');
                                }
                                if (localStorage.getItem('poscustomer')) {
                                    localStorage.removeItem('poscustomer');
                                }
                                if (localStorage.getItem('poscurrency')) {
                                    localStorage.removeItem('poscurrency');
                                }
                                if (localStorage.getItem('posdate')) {
                                    localStorage.removeItem('posdate');
                                }
                                if (localStorage.getItem('posstatus')) {
                                    localStorage.removeItem('posstatus');
                                }
                                if (localStorage.getItem('posbiller')) {
                                    localStorage.removeItem('posbiller');
                                }

                                $('#modal-loading').show();
                                window.location.href = site.base_url + 'pos';
                            } else {
                                bootbox.alert('Wrong Pin Code');
                            }
                        },
                    },
                },
            });
        } else {
            bootbox.confirm('Are You Sure', function (result) {
                if (result) {
                    if (localStorage.getItem('positems')) {
                        localStorage.removeItem('positems');
                    }
                    if (localStorage.getItem('posdiscount')) {
                        localStorage.removeItem('posdiscount');
                    }
                    if (localStorage.getItem('postax2')) {
                        localStorage.removeItem('postax2');
                    }
                    if (localStorage.getItem('posshipping')) {
                        localStorage.removeItem('posshipping');
                    }
                    if (localStorage.getItem('posref')) {
                        localStorage.removeItem('posref');
                    }
                    if (localStorage.getItem('poswarehouse')) {
                        localStorage.removeItem('poswarehouse');
                    }
                    if (localStorage.getItem('posnote')) {
                        localStorage.removeItem('posnote');
                    }
                    if (localStorage.getItem('posinnote')) {
                        localStorage.removeItem('posinnote');
                    }
                    if (localStorage.getItem('poscustomer')) {
                        localStorage.removeItem('poscustomer');
                    }
                    if (localStorage.getItem('poscurrency')) {
                        localStorage.removeItem('poscurrency');
                    }
                    if (localStorage.getItem('posdate')) {
                        localStorage.removeItem('posdate');
                    }
                    if (localStorage.getItem('posstatus')) {
                        localStorage.removeItem('posstatus');
                    }
                    if (localStorage.getItem('posbiller')) {
                        localStorage.removeItem('posbiller');
                    }

                    $('#modal-loading').show();
                    window.location.href = site.base_url + 'sales/pos';
                }
            });
        }
    });
    /* ------------------------------
     * Show manual item addition modal
     ------------------------------- */
     $(document).on('click', '#addManually', function (e) {
        if (count == 1) {
            positems = {};
            if ($('#poswarehouse').val() && $('#poscustomer').val()) {
                $('#poscustomer').select2('readonly', true);
                $('#poswarehouse').select2('readonly', true);
            } else {
                bootbox.alert(lang.select_above);
                item = null;
                return false;
            }
        }
        $('#mnet_price').text('0.00');
        $('#mpro_tax').text('0.00');
        $('#mModal').appendTo('body').modal('show');
        return false;
    });

    $(document).on('click', '#addItemManually', function (e) {
        var mid = new Date().getTime(),
            mcode = $('#mcode').val(),
            mname = $('#mname').val(),
            mtax = parseInt($('#mtax').val()),
            mqty = parseFloat($('#mquantity').val()),
            mdiscount = $('#mdiscount').val() ? $('#mdiscount').val() : '0',
            unit_price = parseFloat($('#mprice').val()),
            mtax_rate = {};
        if (mcode && mname && mqty && unit_price) {
            $.each(tax_rates, function () {
                if (this.id == mtax) {
                    mtax_rate = this;
                }
            });

            positems[mid] = {
                id: mid,
                item_id: mid,
                label: mname + ' (' + mcode + ')',
                row: {
                    id: mid,
                    code: mcode,
                    name: mname,
                    quantity: mqty,
                    base_quantity: mqty,
                    price: unit_price,
                    unit_price: unit_price,
                    real_unit_price: unit_price,
                    tax_rate: mtax,
                    tax_method: 0,
                    qty: mqty,
                    type: 'manual',
                    discount: mdiscount,
                    serial: '',
                    option: '',
                },
                tax_rate: mtax_rate,
                units: false,
                options: false,
            };
            localStorage.setItem('positems', JSON.stringify(positems));
            loadItems();
        }
        $('#mModal').modal('hide');
        $('#mcode').val('');
        $('#mname').val('');
        $('#mtax').val('');
        $('#mquantity').val('');
        $('#mdiscount').val('');
        $('#mprice').val('');
        return false;
    });

    $(document).on('change', '#mprice, #mtax, #mdiscount', function () {
        var unit_price = parseFloat($('#mprice').val());
        var ds = $('#mdiscount').val() ? $('#mdiscount').val() : '0';
        if (ds.indexOf('%') !== -1) {
            var pds = ds.split('%');
            if (!isNaN(pds[0])) {
                item_discount = parseFloat((unit_price * parseFloat(pds[0])) / 100);
            } else {
                item_discount = parseFloat(ds);
            }
        } else {
            item_discount = parseFloat(ds);
        }
        unit_price -= item_discount;
        var pr_tax = $('#mtax').val(),
            item_tax_method = 0;
        var pr_tax_val = 0,
            pr_tax_rate = 0;
        if (pr_tax !== null && pr_tax != 0) {
            $.each(tax_rates, function () {
                if (this.id == pr_tax) {
                    if (this.type == 1) {
                        if (item_tax_method == 0) {
                            pr_tax_val = formatDecimal((unit_price * parseFloat(this.rate)) / (100 + parseFloat(this.rate)));
                            pr_tax_rate = formatDecimal(this.rate) + '%';
                            unit_price -= pr_tax_val;
                        } else {
                            pr_tax_val = formatDecimal((unit_price * parseFloat(this.rate)) / 100);
                            pr_tax_rate = formatDecimal(this.rate) + '%';
                        }
                    } else if (this.type == 2) {
                        pr_tax_val = parseFloat(this.rate);
                        pr_tax_rate = this.rate;
                    }
                }
            });
        }
        pr_tax_val = isNaN(pr_tax_val) ? 0.0 : pr_tax_val; 
        unit_price = isNaN(unit_price) ? 0.0 : unit_price; 
        $('#mnet_price').text(formatMoney(unit_price));
        $('#mpro_tax').text(formatMoney(pr_tax_val));
    });

    /* --------------------------
     * Edit Row Quantity Method
    --------------------------- */
    var old_row_qty;
    $(document)
        .on('focus', '.rquantity', function () {
            old_row_qty = $(this).val();
        })
        .on('change', '.rquantity', function () {
            var row = $(this).closest('tr');
            if (!is_numeric($(this).val()) || parseFloat($(this).val()) < 0) {
                $(this).val(old_row_qty);
                bootbox.alert(lang.unexpected_value);
                return;
            }
            var new_qty = parseFloat($(this).val()),
                item_id = row.attr('data-item-id');
            positems[item_id].row.base_quantity = new_qty;
            if (positems[item_id].row.unit != positems[item_id].row.base_unit) {
                $.each(positems[item_id].units, function () {
                    if (this.id == positems[item_id].row.unit) {
                        positems[item_id].row.base_quantity = unitToBaseQty(new_qty, this);
                    }
                });
            }
            positems[item_id].row.qty = new_qty;
            localStorage.setItem('positems', JSON.stringify(positems));
            loadItems();
        });

         /* ----------------------
        * Delete Row Method
        * ---------------------- */
        var pwacc = false;
        $(document).on('click', '.posdel', function () {
            var row = $(this).closest('tr');
            var item_id = row.attr('data-item-id');

            delete positems[item_id];
            localStorage.setItem('positems', JSON.stringify(positems));
            loadItems();
            
            return false;
        });

        /* -----------------------
     * Edit Row Modal Hanlder
     ----------------------- */
     $(document).on('click', '.edit', function () {
        var row = $(this).closest('tr');
        var row_id = row.attr('id');
        item_id = row.attr('data-item-id');
        item = positems[item_id];
        var qty = row.children().children('.rquantity').val(),
            product_option = row.children().children('.roption').val(),
            unit_price = formatDecimal(row.children().children('.ruprice').val()),
            discount = row.children().children('.rdiscount').val();
        if (item.options !== false) {
            $.each(item.options, function () {
                if (this.id == item.row.option && this.price != 0 && this.price != '' && this.price != null) {
                    unit_price = parseFloat(item.row.real_unit_price) + parseFloat(this.price);
                }
            });
        }
        var real_unit_price = item.row.real_unit_price;
        var net_price = unit_price;
        $('#prModalLabel').text(item.row.code + ' - ' + item.row.name);
        if (site.settings.tax1) {
            $('#ptax').select2('val', item.row.tax_rate);
            $('#old_tax').val(item.row.tax_rate);
            var item_discount = 0,
                ds = discount ? discount : '0';
            if (ds.indexOf('%') !== -1) {
                var pds = ds.split('%');
                if (!isNaN(pds[0])) {
                    item_discount = formatDecimal(parseFloat((unit_price * parseFloat(pds[0])) / 100), 4);
                } else {
                    item_discount = parseFloat(ds);
                }
            } else {
                item_discount = parseFloat(ds);
            }
            // console.log(tax_rates);
            net_price -= item_discount;
            var pr_tax = item.row.tax_rate,
                pr_tax_val = 0;
            if (pr_tax !== null && pr_tax != 0) {
                $.each(tax_rates, function () {
                    if (this.id == pr_tax) {
                        if (this.type == 1) {
                            if (positems[item_id].row.tax_method == 0) {
                                pr_tax_val = formatDecimal((net_price * parseFloat(this.rate)) / (100 + parseFloat(this.rate)), 4);
                                pr_tax_rate = formatDecimal(this.rate) + '%';
                                net_price -= pr_tax_val;
                            } else {
                                pr_tax_val = formatDecimal((net_price * parseFloat(this.rate)) / 100, 4);
                                pr_tax_rate = formatDecimal(this.rate) + '%';
                            }
                        } else if (this.type == 2) {
                            pr_tax_val = parseFloat(this.rate);
                            pr_tax_rate = this.rate;
                        }
                    }
                });
            }
        }
        if (site.settings.product_serial !== 0) {
            $('#pserial').val(row.children().children('.rserial').val());
        }
        // console.log(item.options);
        var opt = '<p style="margin: 12px 0 0 0;">n/a</p>';
        if (item.options !== false) {
            // console.log(item.options);
            var o = 1;
            opt = $('<select id="poption" name="poption" class="form-control select2" />');
            $.each(item.options, function () {
                if (o == 1) {
                    if (product_option == '') {
                        product_variant = this.id;
                    } else {
                        product_variant = product_option;
                    }
                }
                $('<option />', { value: this.id, text: this.name }).appendTo(opt);
                o++;
            });
        } else {
            product_variant = 0;
        }
        // console.log(item.units);
        // console.log(Object.keys(item.units).length);
        if (item.units !== false) {
            uopt = $('<select id="punit" name="punit" class="form-control select2" />');
            $.each(item.units, function () {
                if (this.id == item.row.unit) {
                    $('<option />', { value: this.id, text: this.name, selected: true }).appendTo(uopt);
                } else {
                    $('<option />', { value: this.id, text: this.name }).appendTo(uopt);
                }
            });
        } else {
            uopt = '<p style="margin: 12px 0 0 0;">n/a</p>';
        }

        $('#poptions-div').html(opt);
        $('#punits-div').html(uopt);
        $('select.select').select2({ minimumResultsForSearch: 7 });
        $('#pquantity').val(qty);
        $('#old_qty').val(qty);
        $('#pprice').val(unit_price);
        $('#punit_price').val(formatDecimal(parseFloat(unit_price) + parseFloat(pr_tax_val)));
        $('#poption').select2('val', item.row.option);
        $('#old_price').val(unit_price);
        $('#row_id').val(row_id);
        $('#item_id').val(item_id);
        $('#pserial').val(row.children().children('.rserial').val());
        $('#pdiscount').val(discount);
        $('#padiscount').val('');
        $('#psubt').val(row.find('.ssubtotal').text());
        $('#net_price').text(formatMoney(net_price));
        $('#pro_tax').text(formatMoney(pr_tax_val));
        $('#prModal').appendTo('body').modal('show');
    });

    /* -----------------------
     * Edit Row Method
     ----------------------- */
     $(document).on('click', '#editItem', function () {
        var row = $('#' + $('#row_id').val());
        var item_id = row.attr('data-item-id'),
            new_pr_tax = $('#ptax').val(),
            new_pr_tax_rate = false;
        if (new_pr_tax) {
            $.each(tax_rates, function () {
                if (this.id == new_pr_tax) {
                    new_pr_tax_rate = this;
                }
            });
        }
        var price = parseFloat($('#pprice').val());
        var unit = $('#punit').val();
        var base_quantity = parseFloat($('#pquantity').val());
        if (unit != positems[item_id].row.base_unit) {
            $.each(positems[item_id].units, function () {
                if (this.id == unit) {
                    base_quantity = unitToBaseQty($('#pquantity').val(), this);
                }
            });
        }
        if (item.options !== false) {
            var opt = $('#poption').val();
            $.each(item.options, function () {
                if (this.id == opt && this.price != 0 && this.price != '' && this.price != null) {
                    // price = price - parseFloat(this.price) * parseFloat(base_quantity);
                    price = price - parseFloat(this.price);
                }
            });
        }
        if (site.settings.product_discount == 1 && $('#pdiscount').val()) {
            if (!$('#pdiscount').val() || ($('#pdiscount').val() != 0 && $('#pdiscount').val() > price)) {
                bootbox.alert(lang.unexpected_value);
                return false;
            }
        }
        var discount = $('#pdiscount').val() ? $('#pdiscount').val() : '';
        if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
            $(this).val(old_row_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var quantity = parseFloat($('#pquantity').val());

        positems[item_id].row.fup = 1;
        positems[item_id].row.qty = parseFloat($('#pquantity').val());
        positems[item_id].row.base_quantity = parseFloat(base_quantity);
        positems[item_id].row.real_unit_price = price;
        positems[item_id].row.unit = unit;
        positems[item_id].row.tax_rate = new_pr_tax;
        positems[item_id].tax_rate = new_pr_tax_rate;
        positems[item_id].row.discount = discount;
        positems[item_id].row.option = $('#poption').val() ? $('#poption').val() : '';
        positems[item_id].row.serial = $('#pserial').val();
        localStorage.setItem('positems', JSON.stringify(positems));
        $('#prModal').modal('hide');

        loadItems();
        return;
    });

   }); /* End ready() function */

   /* -----------------------------
 * Add Sale Order Item Function
 * @param {json} item
 * @returns {Boolean}
 ---------------------------- */
 function add_invoice_item(item) {
    // console.log(item);
    /* if count is 1 then initialize empty positems */
    if (count == 1) {
        positems = {};
        if ($('#poswarehouse').val() && $('#poscustomer').val()) {
            $('#poscustomer').select2('readonly', true);
            $('#poswarehouse').select2('readonly', true);
        } else {
            // bootbox.alert(lang.select_above);
            item = null;
            return;
        }
    }
    if (item == null) return;
    var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
    /** 
      * if item is already in positems list
      */
    if (positems[item_id]) {
        var new_qty = parseFloat(positems[item_id].row.qty) + 1;
        positems[item_id].row.base_quantity = new_qty;
        if (positems[item_id].row.unit != positems[item_id].row.base_unit) {
            $.each(positems[item_id].units, function () {
                if (this.id == positems[item_id].row.unit) {
                    positems[item_id].row.base_quantity = unitToBaseQty(new_qty, this);
                }
            });
        }
        positems[item_id].row.qty = new_qty;
    } else {
        positems[item_id] = item;
    }
    positems[item_id].order = new Date().getTime();
    // console.log('positems: ', positems);
    localStorage.setItem('positems', JSON.stringify(positems));
    loadItems();
    return true;
}


//localStorage.clear();
function loadItems() {
    if (localStorage.getItem('positems')) {
        total = 0;
        count = 1;
        an = 1;
        product_tax = 0;
        invoice_tax = 0;
        product_discount = 0;
        order_discount = 0;
        total_discount = 0;
        order_data = {};
        bill_data = {};

        $('#posTable tbody').empty();
        var time = new Date().getTime() / 1000;
        if (pos_settings.remote_printing != 1) {
            store_name = biller && biller.company != '-' ? biller.company : biller.name;
            order_data.store_name = store_name;
            bill_data.store_name = store_name;
            order_data.header = '\n' + lang.order + '\n\n';
            bill_data.header = '\n' + lang.bill + '\n\n';

            var pos_customer = 'C: ' + $('#select2-chosen-1').text() + '\n';
            var hr = 'R: ' + $('#reference_note').val() + '\n';
            var user = 'U: ' + username + '\n';
            var pos_curr_time = 'T: ' + date(site.dateFormats.php_ldate, time) + '\n';
            var ob_info = pos_customer + hr + user + pos_curr_time + '\n';
            order_data.info = ob_info;
            bill_data.info = ob_info;
            var o_items = '';
            var b_items = '';
        } else {
            $('#order_span').empty();
            $('#bill_span').empty();
            var styles =
                '<style>table, th, td { border-collapse:collapse; border-bottom: 1px solid #CCC; } .no-border { border: 0; } .bold { font-weight: bold; }</style>';
            var pos_head1 = '<span style="text-align:center;"><h3>' + site.settings.site_name + '</h3><h4>';
            var pos_head2 =
                '</h4><p class="text-left">C: ' +
                $('#select2-chosen-1').text() +
                '<br>R: ' +
                $('#reference_note').val() +
                '<br>U: ' +
                username +
                '<br>T: ' +
                /*date(site.dateFormats.php_ldate, time)*/ +
                '</p></span>';
            $('#order_span').prepend(styles + pos_head1 + ' ' + lang.order + ' ' + pos_head2);
            $('#bill_span').prepend(styles + pos_head1 + ' ' + lang.bill + ' ' + pos_head2);
            $('#order-table').empty();
            $('#bill-table').empty();
        }
        positems = JSON.parse(localStorage.getItem('positems'));
        if (pos_settings.item_order == 1) {
            // sortedItems = _.sortBy(positems, function (o) {
            //     return [parseInt(o.category), parseInt(o.order)];
            // });
            sortedItems = positems;
        } else if (site.settings.item_addition != 1) {
            // sortedItems = _.sortBy(positems, function (o) {
            //     return [parseInt(o.order)];
            // });
            sortedItems = positems;
        } else {
            sortedItems = positems;
        }
        var category = 0,
            print_cate = false;
        // var itn = parseInt(Object.keys(sortedItems).length);
        $.each(sortedItems, function () {
            console.log(this); 
            var item = this;
            var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
            positems[item_id] = item;
            item.order = item.order ? item.order : new Date().getTime();
            var product_id = item.row.id,
                item_type = item.row.type,
                combo_items = item.combo_items,
                item_price = item.row.price,
                item_qty = item.row.qty,
                item_aqty = item.row.quantity,
                item_tax_method = item.row.tax_method,
                item_ds = item.row.discount,
                item_discount = 0,
                item_option = item.row.option,
                item_code = item.row.code,
                item_serial = item.row.serial,
                item_name = item.row.name.replace(/"/g, '&#034;').replace(/'/g, '&#039;');
            var product_unit = item.row.unit,
                base_quantity = item.row.base_quantity;
            var unit_price = item.row.real_unit_price;
            var item_comment = item.row.comment ? item.row.comment : '';
            var item_ordered = item.row.ordered ? item.row.ordered : 0;
            if (item.units && item.row.fup != 1 && product_unit != item.row.base_unit) {
                $.each(item.units, function () {
                    if (this.id == product_unit) {
                        base_quantity = formatDecimal(unitToBaseQty(item.row.qty, this), 4);
                        unit_price = formatDecimal(parseFloat(item.row.base_unit_price) * unitToBaseQty(1, this), 4);
                    }
                });
            }
            var sel_opt = '';
            if (item.options !== false) {
                $.each(item.options, function () {
                    if (this.id == item_option) {
                        sel_opt = this.name;
                        if (this.price != 0 && this.price != '' && this.price != null) {
                            // item_price = unit_price + parseFloat(this.price) * parseFloat(base_quantity);
                            item_price = parseFloat(unit_price) + parseFloat(this.price);
                            unit_price = item_price;
                        }
                    }
                });
            }

            var ds = item_ds ? item_ds : '0';
            if (ds.indexOf('%') !== -1) {
                var pds = ds.split('%');
                if (!isNaN(pds[0])) {
                    item_discount = formatDecimal(parseFloat((unit_price * parseFloat(pds[0])) / 100), 4);
                } else {
                    item_discount = formatDecimal(ds);
                }
            } else {
                item_discount = formatDecimal(ds);
            }
            product_discount += formatDecimal(item_discount * item_qty);

            unit_price = formatDecimal(unit_price - item_discount);
            var pr_tax = item.tax_rate;
            var pr_tax_val = 0,
                pr_tax_rate = 0;
            if (site.settings.tax1 == 1) {
                if (pr_tax !== false && pr_tax != 0) {
                    if (pr_tax.type == 1) {
                        if (item_tax_method == '0') {
                            pr_tax_val = formatDecimal((unit_price * parseFloat(pr_tax.rate)) / (100 + parseFloat(pr_tax.rate)), 4);
                            pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
                        } else {
                            pr_tax_val = formatDecimal((unit_price * parseFloat(pr_tax.rate)) / 100, 4);
                            pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
                        }
                    } else if (pr_tax.type == 2) {
                        pr_tax_val = formatDecimal(pr_tax.rate);
                        pr_tax_rate = pr_tax.rate;
                    }
                    product_tax += pr_tax_val * item_qty;
                }
            }
            pr_tax_val = formatDecimal(pr_tax_val);
            item_price = item_tax_method == 0 ? formatDecimal(unit_price - pr_tax_val, 4) : formatDecimal(unit_price);
            unit_price = formatDecimal(unit_price + item_discount, 4);

            if (pos_settings.item_order == 1 && category != item.row.category_id) {
                category = item.row.category_id;
                print_cate = true;
                var newTh = $('<tr></tr>');
                newTh.html('<td colspan="100%"><strong>' + item.row.category_name + '</strong></td>');
                newTh.appendTo('#posTable');
            } else {
                print_cate = false;
            }

            var row_no = item.id;
            var newTr = $(
                '<tr id="row_' +
                    row_no +
                    '" class="row_' +
                    item_id +
                    (item.free ? ' warning' : '') +
                    '" data-item-id="' +
                    item_id +
                    '"></tr>'
            );

            tr_html =
                '<td><input name="product_id[]" type="hidden" class="rid" value="' +
                product_id +
                '"><input name="product_type[]" type="hidden" class="rtype" value="' +
                item_type +
                '"><input name="product_code[]" type="hidden" class="rcode" value="' +
                item_code +
                '"><input name="product_name[]" type="hidden" class="rname" value="' +
                item_name +
                '"><input name="product_option[]" type="hidden" class="roption" value="' +
                item_option +
                '"><input name="product_comment[]" type="hidden" class="rcomment" value="' +
                item_comment +
                '"><span class="sname" id="name_' +
                row_no +
                '">' +
                item_code +
                ' - ' +
                item_name +
                (sel_opt != '' ? ' (' + sel_opt + ')' : '') +
                '</span><span class="lb"></span>' +
                (item.free
                    ? ''
                    : '<i class="pull-right fa fa-edit fa-bx tip pointer edit" id="' +
                      row_no +
                      '" data-item="' +
                      item_id +
                      '" title="Edit" style="cursor:pointer;"></i>') +
                '</i></td>';
            tr_html += '<td class="text-right">';
            if (site.settings.product_serial == 1) {
                tr_html +=
                    '<input class="form-control input-sm rserial" name="serial[]" type="hidden" id="serial_' +
                    row_no +
                    '" value="' +
                    item_serial +
                    '">';
            }
            if (site.settings.product_discount == 1) {
                tr_html +=
                    '<input class="form-control input-sm rdiscount" name="product_discount[]" type="hidden" id="discount_' +
                    row_no +
                    '" value="' +
                    item_ds +
                    '">';
            }
            if (site.settings.tax1 == 1) {
                tr_html +=
                    '<input class="form-control input-sm text-right rproduct_tax" name="product_tax[]" type="hidden" id="product_tax_' +
                    row_no +
                    '" value="' +
                    pr_tax.id +
                    '"><input type="hidden" class="sproduct_tax" id="sproduct_tax_' +
                    row_no +
                    '" value="' +
                    formatMoney(pr_tax_val * item_qty) +
                    '">';
            }
            tr_html +=
                '<input class="rprice" name="net_price[]" type="hidden" id="price_' +
                row_no +
                '" value="' +
                item_price +
                '"><input class="ruprice" name="unit_price[]" type="hidden" value="' +
                unit_price +
                '"><input class="realuprice" name="real_unit_price[]" type="hidden" value="' +
                item.row.real_unit_price +
                '"><span class="text-right sprice" id="sprice_' +
                row_no +
                '">' +
                formatMoney(parseFloat(item_price) + parseFloat(pr_tax_val)) +
                '</span></td>';
            tr_html +=
                '<td>' +
                (item.free
                    ? '<div class="text-center">' +
                      item_qty +
                      '<input type="hidden" name="quantity[]" type="text"  value="' +
                      formatQuantity2(item_qty) +
                      '"></div>'
                    : '<input class="form-control input-sm kb-pad text-center rquantity" tabindex="' +
                      (site.settings.set_focus == 1 ? an : an + 1) +
                      '" name="quantity[]" type="text"  value="' +
                      formatQuantity2(item_qty) +
                      '" data-id="' +
                      row_no +
                      '" data-item="' +
                      item_id +
                      '" id="quantity_' +
                      row_no +
                      '" onClick="this.select();">') +
                '<input name="product_unit[]" type="hidden" class="runit" value="' +
                product_unit +
                '"><input name="product_base_quantity[]" type="hidden" class="rbase_quantity" value="' +
                base_quantity +
                '"></td>';
            tr_html +=
                '<td class="text-right"><span class="text-right ssubtotal" id="subtotal_' +
                row_no +
                '">' +
                formatMoney((parseFloat(item_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty)) +
                '</span></td>';
            tr_html +=
                '<td class="text-center"><i class="fa fa-times tip pointer posdel" id="' +
                row_no +
                '" title="Remove" style="cursor:pointer;"></i></td>';
            newTr.html(tr_html);
            if (pos_settings.item_order == 1) {
                newTr.appendTo('#posTable');
            } else {
                newTr.prependTo('#posTable');
            }
            total += formatDecimal((parseFloat(item_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty), 4);
            count += parseFloat(item_qty);
            // console.log('total: ', count);
            an++;

            if (item_type == 'standard' && item.options !== false) {
                $.each(item.options, function () {
                    if (this.id == item_option && base_quantity > this.quantity) {
                        $('#row_' + row_no).addClass('danger');
                    }
                });
            } else if (item_type == 'standard' && base_quantity > item_aqty) {
                $('#row_' + row_no).addClass('danger');
            } else if (item_type == 'combo') {
                if (combo_items === false) {
                    $('#row_' + row_no).addClass('danger');
                } else {
                    $.each(combo_items, function () {
                        if (parseFloat(this.quantity) < parseFloat(this.qty) * base_quantity && this.type == 'standard') {
                            $('#row_' + row_no).addClass('danger');
                        }
                    });
                }
            }

            var comments = item_comment.split(/\r?\n/g);
            if (pos_settings.remote_printing != 1) {
                b_items += product_name('#' + (an - 1) + ' ' + item_code + ' - ' + item_name) + '\n';
                for (var i = 0, len = comments.length; i < len; i++) {
                    b_items += comments[i].length > 0 ? '   * ' + comments[i] + '\n' : '';
                }
                b_items +=
                    printLine(
                        '   ' +
                            formatDecimal(item_qty) +
                            ' x ' +
                            formatMoney(parseFloat(item_price) + parseFloat(pr_tax_val)) +
                            ': ' +
                            formatMoney((parseFloat(item_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty))
                    ) + '\n';
                // o_items += printLine(product_name("#"+(an-1)+" "+ item_code + " - " + item_name) + ": [ "+ (item_ordered != 0 ? 'xxxx' : formatDecimal(item_qty))) + " ]\n";
                o_items +=
                    printLine(
                        product_name('#' + (an - 1) + ' ' + item_code + ' - ' + item_name) + ': [ ' + formatDecimal(item_qty) + ' ]'
                    ) + '\n';
                for (var i = 0, len = comments.length; i < len; i++) {
                    o_items += comments[i].length > 0 ? '   * ' + comments[i] + '\n' : '';
                }
                o_items += '\n';
            } else {
                if (pos_settings.item_order == 1 && print_cate) {
                    var bprTh = $('<tr></tr>');
                    bprTh.html('<td colspan="100%" class="no-border"><strong>' + item.row.category_name + '</strong></td>');
                    var oprTh = $('<tr></tr>');
                    oprTh.html('<td colspan="100%" class="no-border"><strong>' + item.row.category_name + '</strong></td>');
                    $('#order-table').append(oprTh);
                    $('#bill-table').append(bprTh);
                }
                var bprTr =
                    '<tr class="row_' +
                    item_id +
                    '" data-item-id="' +
                    item_id +
                    '"><td colspan="2" class="no-border">#' +
                    (an - 1) +
                    ' ' +
                    item_code +
                    ' - ' +
                    item_name +
                    (sel_opt != '' ? ' (' + sel_opt + ')' : '') +
                    '';
                for (var i = 0, len = comments.length; i < len; i++) {
                    bprTr += comments[i] ? '<br> <b>*</b> <small>' + comments[i] + '</small>' : '';
                }
                bprTr += '</td></tr>';
                bprTr +=
                    '<tr class="row_' +
                    item_id +
                    '" data-item-id="' +
                    item_id +
                    '"><td>(' +
                    formatDecimal(item_qty) +
                    ' x ' +
                    (item_discount != 0
                        ? '<del>' + formatMoney(parseFloat(item_price) + parseFloat(pr_tax_val) + item_discount) + '</del>'
                        : '') +
                    formatMoney(parseFloat(item_price) + parseFloat(pr_tax_val)) +
                    ')</td><td style="text-align:right;">' +
                    formatMoney((parseFloat(item_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty)) +
                    '</td></tr>';
                var oprTr =
                    '<tr class="row_' +
                    item_id +
                    '" data-item-id="' +
                    item_id +
                    '"><td>#' +
                    (an - 1) +
                    ' ' +
                    item_code +
                    ' - ' +
                    item_name +
                    (sel_opt != '' ? ' (' + sel_opt + ')' : '') +
                    '';
                for (var i = 0, len = comments.length; i < len; i++) {
                    oprTr += comments[i] ? '<br> <b>*</b> <small>' + comments[i] + '</small>' : '';
                }
                // oprTr += '</td><td>[ ' + (item_ordered != 0 ? 'xxxx' : formatDecimal(item_qty)) +' ]</td></tr>';
                oprTr += '</td><td>[ ' + formatDecimal(item_qty) + ' ]</td></tr>';
                $('#order-table').append(oprTr);
                $('#bill-table').append(bprTr);
            }
        });
        // Order level discount calculations
        if ((posdiscount = localStorage.getItem('posdiscount'))) {
            var ds = posdiscount;
            if (ds.indexOf('%') !== -1) {
                var pds = ds.split('%');
                if (!isNaN(pds[0])) {
                    order_discount = formatDecimal(parseFloat((total * parseFloat(pds[0])) / 100), 4);
                } else {
                    order_discount = parseFloat(ds);
                }
            } else {
                order_discount = parseFloat(ds);
            }
            //total_discount += parseFloat(order_discount);
        }

        // Order level tax calculations
        if (site.settings.tax2 != 0) {
            if ((postax2 = localStorage.getItem('postax2'))) {
                $.each(tax_rates, function () {
                    if (this.id == postax2) {
                        if (this.type == 2) {
                            invoice_tax = formatDecimal(this.rate);
                        }
                        if (this.type == 1) {
                            invoice_tax = formatDecimal(((total - order_discount) * this.rate) / 100, 4);
                        }
                    }
                });
            }
        }

        total = formatDecimal(total);
        product_tax = formatDecimal(product_tax);
        total_discount = formatDecimal(order_discount + product_discount);

        // Totals calculations after item addition
        
        var gtotal = parseFloat(total + invoice_tax - order_discount + parseFloat(shipping));
        $('#total').text(formatMoney(total));
        $('#titems').text(an - 1 + ' (' + formatQty(parseFloat(count) - 1) + ')');
        $('#total_items').val(parseFloat(count) - 1);
        $('#tds').text('(' + formatMoney(product_discount) + ') ' + formatMoney(order_discount));
        if (site.settings.tax2 != 0) {
            $('#ttax2').text(formatMoney(invoice_tax));
        }
        $('#tship').text(parseFloat(shipping) > 0 ? formatMoney(shipping) : '');
        $('#gtotal').text(formatMoney(gtotal));
        if (pos_settings.remote_printing != 1) {
            order_data.items = o_items;
            bill_data.items = b_items;
            var b_totals = '';
            b_totals += printLine(lang.total + ': ' + formatMoney(total)) + '\n';
            if (order_discount > 0 || product_discount > 0) {
                b_totals += printLine(lang.discount + ': ' + formatMoney(order_discount + product_discount)) + '\n';
            }
            if (site.settings.tax2 != 0 && invoice_tax != 0) {
                b_totals += printLine(lang.order_tax + ': ' + formatMoney(invoice_tax)) + '\n';
            }
            b_totals += printLine(lang.grand_total + ': ' + formatMoney(gtotal)) + '\n';
            if (pos_settings.rounding != 0) {
                round_total = roundNumber(gtotal, parseInt(pos_settings.rounding));
                var rounding = formatDecimal(round_total - gtotal);
                b_totals += printLine(lang.rounding + ': ' + formatMoney(rounding)) + '\n';
                b_totals += printLine(lang.total_payable + ': ' + formatMoney(round_total)) + '\n';
            }
            b_totals += '\n' + lang.items + ': ' + (an - 1) + ' (' + (parseFloat(count) - 1) + ')' + '\n';
            bill_data.totals = b_totals;
            bill_data.footer = '\n' + lang.merchant_copy + '\n';
        } else {
            var bill_totals = '';
            bill_totals += '<tr class="bold"><td>' + lang.total + '</td><td style="text-align:right;">' + formatMoney(total) + '</td></tr>';

            if (order_discount > 0 || product_discount > 0) {
                bill_totals +=
                    '<tr class="bold"><td>' +
                    lang.discount +
                    '</td><td style="text-align:right;">' +
                    formatMoney(order_discount + product_discount) +
                    '</td></tr>';
            }
            if (site.settings.tax2 != 0 && invoice_tax != 0) {
                bill_totals +=
                    '<tr class="bold"><td>' +
                    lang.order_tax +
                    '</td><td style="text-align:right;">' +
                    formatMoney(invoice_tax) +
                    '</td></tr>';
            }
            bill_totals +=
                '<tr class="bold"><td>' + lang.grand_total + '</td><td style="text-align:right;">' + formatMoney(gtotal) + '</td></tr>';
            if (pos_settings.rounding != 0) {
                round_total = roundNumber(gtotal, parseInt(pos_settings.rounding));
                var rounding = formatDecimal(round_total - gtotal);
                bill_totals +=
                    '<tr class="bold"><td>' + lang.rounding + '</td><td style="text-align:right;">' + formatMoney(rounding) + '</td></tr>';
                bill_totals +=
                    '<tr class="bold"><td>' +
                    lang.total_payable +
                    '</td><td style="text-align:right;">' +
                    formatMoney(round_total) +
                    '</td></tr>';
            }
            bill_totals +=
                '<tr class="bold"><td>' +
                lang.items +
                '</td><td style="text-align:right;">' +
                (an - 1) +
                ' (' +
                (parseFloat(count) - 1) +
                ')</td></tr>';
            $('#bill-total-table').empty();
            $('#bill-total-table').append(bill_totals);
            $('#bill_footer').append('<p class="text-center"><br>' + lang.merchant_copy + '</p>');
        }
        if (count > 1) {
            $('#poscustomer').select2('readonly', true);
            $('#poswarehouse').select2('readonly', true);
        } else {
            $('#poscustomer').select2('readonly', false);
            $('#poswarehouse').select2('readonly', false);
        }
        if (KB) {
            // display_keyboards();
        }
        if (site.settings.set_focus == 1) {
            $('#add_item').attr('tabindex', an);
            $('[tabindex=' + (an - 1) + ']')
                .focus()
                .select();
        } else {
            $('#add_item').attr('tabindex', 1);
            $('#add_item').focus();
        }
    }
}


function display_keyboards() {
    $('.kb-text').keyboard({
        autoAccept: true,
        alwaysOpen: false,
        openOn: 'focus',
        usePreview: false,
        layout: 'custom',
        //layout: 'qwerty',
        display: {
            bksp: '\u2190',
            accept: 'return',
            default: 'ABC',
            meta1: '123',
            meta2: '#+=',
        },
        customLayout: {
            default: [
                'q w e r t y u i o p {bksp}',
                'a s d f g h j k l {enter}',
                '{s} z x c v b n m , . {s}',
                '{meta1} {space} {cancel} {accept}',
            ],
            shift: [
                'Q W E R T Y U I O P {bksp}',
                'A S D F G H J K L {enter}',
                '{s} Z X C V B N M / ? {s}',
                '{meta1} {space} {meta1} {accept}',
            ],
            meta1: [
                '1 2 3 4 5 6 7 8 9 0 {bksp}',
                '- / : ; ( ) \u20ac & @ {enter}',
                '{meta2} . , ? ! \' " {meta2}',
                '{default} {space} {default} {accept}',
            ],
            meta2: [
                '[ ] { } # % ^ * + = {bksp}',
                '_ \\ | &lt; &gt; $ \u00a3 \u00a5 {enter}',
                '{meta1} ~ . , ? ! \' " {meta1}',
                '{default} {space} {default} {accept}',
            ],
        },
    });
    $('.kb-pad').keyboard({
        restrictInput: true,
        preventPaste: true,
        autoAccept: true,
        alwaysOpen: false,
        openOn: 'click',
        usePreview: false,
        layout: 'custom',
        display: {
            b: '\u2190:Backspace',
        },
        customLayout: {
            default: ['1 2 3 {b}', '4 5 6 . {clear}', '7 8 9 0 %', '{accept} {cancel}'],
        },
    });
    var cc_key = site.settings.decimals_sep == ',' ? ',' : '{clear}';
    $('.kb-pad1').keyboard({
        restrictInput: true,
        preventPaste: true,
        autoAccept: true,
        alwaysOpen: false,
        openOn: 'click',
        usePreview: false,
        layout: 'custom',
        display: {
            b: '\u2190:Backspace',
        },
        customLayout: {
            default: ['1 2 3 {b}', '4 5 6 . ' + cc_key, '7 8 9 0 %', '{accept} {cancel}'],
        },
    });
}
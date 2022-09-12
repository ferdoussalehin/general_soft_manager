$(document).ready(function(){
   
});


function formatDecimal(x)
{
    let decimal = parseFloat(x).toFixed(2); 
    return parseFloat(decimal); // decimal will be string so parse it
}
function formatNumber(x)
{
    return parseInt(x);
}
function currencyFormat(x) {
    return '<div class="text-right">' + formatMoney(x != null ? x : 0) + '</div>';
}

function formatQuantity2(x) {
    let nf = Intl.NumberFormat();
    return nf.format(x);
}

function formatQty(x)
{
    return x.toFixed(2);
}

function formatMoney(x, symbol) {
    if (!symbol) {
        symbol = '';
    }
    // let nf = Intl.NumberFormat();
    // return nf.format(x);
    const num = parseFloat(x).toFixed(2);
    return (num).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Number format 123,123.00
}

function ItemnTotals() {
    fixAddItemnTotals();
    $(window).bind('resize', fixAddItemnTotals);
}

function fixAddItemnTotals() {
    var ai = $('#sticker');
    var aiTop = ai.position().top + 250;
    var bt = $('#bottom-total');
    $(window).scroll(function () {
        var windowpos = $(window).scrollTop();
        if (windowpos >= aiTop) {
            ai.addClass('stick').css('width', ai.parent('form').width()).css('zIndex', 2);
            ai.css('top', 0);
            $('#add_item').removeClass('input-lg');
            $('.addIcon').removeClass('fa-2x');
        } else {
            ai.removeClass('stick').css('width', bt.parent('form').width()).css('zIndex', 2);
            ai.css('top', 0);
            $('#add_item').addClass('input-lg');
            $('.addIcon').addClass('fa-2x');
        }
        if (windowpos <= $(document).height() - $(window).height() - 120) {
            bt.css('position', 'fixed').css('bottom', 0).css('width', bt.parent('form').width()).css('zIndex', 2);
        } else {
            bt.css('position', 'static').css('width', ai.parent('form').width()).css('zIndex', 2);
        }
    });
}

function set_page_focus() {
    if (site.settings.set_focus == 1) {
        $('#add_item').attr('tabindex', an);
        $('[tabindex=' + (an - 1) + ']')
            .focus()
            .select();
    } else {
        $('#add_item').attr('tabindex', 1);
        $('#add_item').focus();
    }
    $('.rquantity').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            $('#add_item').focus();
        }
    });
}

function is_numeric(mixed_var) {
    var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    return (
        (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -1)) &&
        mixed_var !== '' &&
        !isNaN(mixed_var)
    );
}

function calculateDiscount(val, amt) {
    if (val.indexOf('%') !== -1) {
        var pds = val.split('%');
        return formatDecimal(parseFloat((amt * parseFloat(pds[0])) / 100), 4);
    }
    return formatDecimal(val);
}

function calculateTax(tax, amt, met) {
    if (tax && tax_rates) {
        tax_val = 0;
        tax_rate = '';
        $.each(tax_rates, function () {
            if (this.id == tax) {
                tax = this;
                return false;
            }
        });
        if (tax.type == 1) {
            if (met == '0') {
                tax_val = formatDecimal((amt * parseFloat(tax.rate)) / (100 + parseFloat(tax.rate)), 4);
                tax_rate = formatDecimal(tax.rate) + '%';
            } else {
                tax_val = formatDecimal((amt * parseFloat(tax.rate)) / 100, 4);
                tax_rate = formatDecimal(tax.rate) + '%';
            }
        } else if (tax.type == 2) {
            tax_val = parseFloat(tax.rate);
            tax_rate = formatDecimal(tax.rate);
        }
        return [tax_val, tax_rate];
    }
    return false;
}

function check_add_item_val() {
    $('#add_item').bind('keypress', function (e) {
        if (e.keyCode == 13 || e.keyCode == 9) {
            e.preventDefault();
            $(this).autocomplete('search');
        }
    });
}
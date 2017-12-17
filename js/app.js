$(function () {

    var baseUrl = 'http://localhost:8282/';
    var list = $('ul.books');
    var form = $('form.save');

    function createBookLiElement(book) {
        return $('<li>', {'data-id': book.id})
            .append('<span>' + book.title + '</span>')
            .append('<button class="edit">edit</button>')
            .append('<button class="delete">delete</button>')
            .append('<div>');
    }

    function createBookDivContent(book) {
        var html = $('<table>');
        for (var key in book) {
            html.append($('<tr>')
                .append($('<td>', {text: key}))
                .append($('<td>', {text: book[key]})))
        }
        return html;
    }

    function createBookEntityFromForm(form) {
        var book = {};
        $(form).find('input[type!=submit]').each(function (index, elem) {
            book[elem.name] = elem.value
        });
        return book;
    }

    function renderList() {
        $.getJSON({
            url: baseUrl + 'books'
        }).done(function (data) {
            list.empty();
            data.forEach(function (book) {
                list.append(createBookLiElement(book));
            })
        });
    }

    list.on('click', 'li', function (e) {
        $.getJSON({
            url: baseUrl + 'books/' + $(e.currentTarget).data('id')
        }).done(function (book) {
            $(e.currentTarget).find('div').html(createBookDivContent(book));
        })
    });

    form.on('submit', function (e) {
        var book = createBookEntityFromForm(this);
        $.post({
            headers: {
                'Content-Type': 'application/json'
            },
            url: baseUrl + 'books/add',
            data: JSON.stringify(book)
        }).done(function () {
            renderList();
        });
        this.reset();
        e.preventDefault();
    });

    list.on('click', 'button.delete', function (e) {
        $.ajax({
            url: baseUrl + 'books/remove/' + $(e.currentTarget).closest('li').data('id'),
            type: 'DELETE'
        }).done(function () {
            renderList();
        });
        e.stopPropagation();
    });

    list.on('click', 'button.edit', function (e) {
        var book = createBookEntityFromForm(form);
        var id = $(e.currentTarget).closest('li').data('id');
        book.id = id;
        $.ajax({
            url: baseUrl + 'books/' + id + '/update',
            type: 'PUT',
            data: JSON.stringify(book)
        }).done(function () {
            renderList();
        });
        e.stopPropagation();
    });

    renderList();
});
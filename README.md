# Tables Generator

### - Заполнять можем только первую таблицу , остальные таблиы можем только редактировать. 
### - кнопка copy для таблицы означает, что текущее её состояние копируется , и появляется под это таблицей её копия. 
### - кнопка удаление талицы => удаляем таблицу ( исходную таблицу - удалить нельзя ) 
### - редактирование и удаление колонок ( меняются данные и удаляется весь row, только той таблицы в которой мы производим манипуляции)
```shell
 в форме заполнения, placeholder должны исчезать при фокусе 
```
```shell
 форма 1 и 2 отвечает за добавление записей в таблицу, расположить на странице их можно произвольно
```
```shell
 если в форме номер 1 что-то набераем , то это обновляется и в форме номер 2
```
### модальная форма - появляется по клику на edit ( в формах 1 и 2 - эти даннные не должны попадать )
### модальная форма расположение прозвольное
### сохранить изменения можно только после нажатия на кнопку agree.
### после сохранения изменений модальная форма закрывается

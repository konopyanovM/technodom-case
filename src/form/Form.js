import React, { Component } from 'react';
// Думал использовать сторонюю технологию и не изобретать велосипед, но на изучение и принцип использования пришлось бы потратить время.Поэтому трачу намного больше времени на создание своей валидации. :)
import { usePaymentInputs } from 'react-payment-inputs';

import './Form.css'

// Components
import Input from './input/Input'
import Submit from './submit/Submit'
import Error from './error/error';

// Images
import img_creditCard from './img/icons/credit-card.png'
import img_masterCard from './img/icons/mastercard.svg'
import img_visaCard from './img/icons/visa.svg'

class Form extends Component {
   state = {
      cardNumber: {
         label: "Card number",
         cardImg: img_creditCard,
         value: '',
      },
      cardExpDate: {
         label: "Expiration date",
         value: '',
         year: '',
         month: '',
         valid: ''
      },
      cardCVV: {
         label: "CVV",
         value: '',
      },
      cardName: {
         label: "Card holder name",
         maxLength: 70,
         value: '',
      },
      submit: {
         text: 'Pay',
      },

      errors: [
      ],

      bankName: '',
   }

   banks = [
      {
         name: 'Kaspi Bank',
         BIN: 516949
      },
      {
         name: 'Halyk Bank',
         BIN: 440563
      },
      {
         name: 'Forte Bank',
         BIN: 513233
      },
   ]

   render() {

      let errors = null;

      errors = this.state.errors.map((error, index) => {
         return (
            <Error
               key={index}
               text={error} />
         )
      })


      return (
         <div className="form-wrapper" >
            <form onSubmit={this.submitHandler} className="form">
               <ul>
                  {errors}
                  {/* <li className='form-error'>{this.state.errors}</li> */}
               </ul>
               <div className="form__header">
                  {/* Errors */}
                  {/* Card name */}
                  <Input label={this.state.cardNumber.label} type="text" name="number" id="number" onChangeHandler={this.cardNumberHandler} maxLength='19' />
                  <img src={this.state.cardNumber.cardImg} className="form-img" />
               </div>
               <div className="form__body">
                  {/* Expiration date */}
                  <Input label={this.state.cardExpDate.label} type="text" name="exp-date" id="exp-date" onChangeHandler={this.cardExpirationDateHandler} placeholder="mm/yy" maxLength='5' />
                  {/* CVV */}
                  <Input label={this.state.cardCVV.label} type="number" name="cvv" id="cvv" onChangeHandler={this.cardCVVHandler} />
                  {/* Bank name */}
                  <p className="form__bank-text">{this.state.bankName}</p>
                  {/* Card name */}
                  <Input label={this.state.cardName.label} type="text" name="name" extraClass="form-label--wrap" id="name" onChangeHandler={this.cardNameHandler} maxLength={this.state.cardName.maxLength} />
               </div>
               <div className="form__footer">
                  {/* Submit button */}
                  <Submit extraClass="button--large" value={this.state.submit.text} />
               </div>
            </form >
         </div >
      )
   }


   cardNumberHandler = (event) => {
      const length = event.target.value.length;
      // Регулярное выражение ниже блокирует пользователю ввод любых символов кроме цифр
      event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
      // Регулярное выражение ниже создает пробелы для более удобного, красивого отображения номера карты
      event.target.value = event.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
      // Убираем последний пробел от регулярного выражения
      if (length === 19) {
         event.target.value = event.target.value.trim();
      }

      this.setState({
         cardNumber: {
            label: this.state.cardNumber.label,
            cardImg: this.state.cardNumber.cardImg,
            value: event.target.value
         }
      })

      // Если номер карты начинается с 4 или 5, то меняем иконка на иконку Visa или Mastercard соответственно
      if (this.state.cardNumber.value && this.state.cardNumber.value[0].includes('4')) {
         this.setState({
            cardNumber: {
               label: this.state.cardNumber.label,
               cardImg: img_visaCard,
               value: event.target.value
            }
         })
      } else if (this.state.cardNumber.value && this.state.cardNumber.value[0].includes('5')) {
         this.setState({
            cardNumber: {
               label: this.state.cardNumber.label,
               cardImg: img_masterCard,
               value: event.target.value
            }
         })
      } else {
         this.setState({
            cardNumber: {
               label: this.state.cardNumber.label,
               cardImg: img_creditCard,
               value: event.target.value
            }
         })
      }

      // Определение банка карты

      if (length >= 7) {
         this.banks.map((bank) => {
            if (bank.BIN === +(this.state.cardNumber.value.replace(' ', '').slice(0, 6))) {
               this.setState({
                  bankName: bank.name
               })
            }
         })
      } else {
         this.setState({
            bankName: ''
         })
      }

      // console.log(this.state.cardNumber.value.length);
      // console.log(this.state.cardNumber.value.length < 19);
   }

   cardExpirationDateHandler = (event) => {
      const length = event.target.value.length;
      // Добавляем слэш если больше двух цифр
      if (length >= 2 && !event.target.value.slice(0, 5).includes('/')) {
         event.target.value += '/';
      }
      // Убираем слэш 
      if (event.target.value.slice(0, 2).includes('/')) {
         event.target.value = '';
      }
      // Очищаем форму если там только слэш
      if (length === 1 && event.target.value.includes('/')) {
         event.target.value = '';
      }

      if (length >= 3) {
         this.setState({
            cardExpDate: {
               label: "Expiration date",
               value: this.state.cardExpDate.value,
               year: this.state.cardExpDate.year,
               month: event.target.value.slice(0, 2),
            },
         })
      }
      if (length === 5) {
         this.setState({
            cardExpDate: {
               label: "Expiration date",
               value: event.target.value,
               year: event.target.value.slice(3, 5),
               month: event.target.value.slice(0, 2),
            },
         })
      }

   }

   cardCVVHandler = event => {
      const length = event.target.value.length;
      // Ограничиваем количество символов если их больше 3, так как мы не можем ипользовать атрибут maxLength из-за типа input='number'
      if (length > 3) {
         event.target.value = event.target.value.slice(0, 3);
      }
      this.setState({
         cardCVV: {
            label: this.state.cardCVV.label,
            value: event.target.value,
         }
      })
   }

   cardNameHandler = event => {
      // Ввод только букв
      event.target.value = event.target.value.replace(/[^a-z\s]/gi, '');
      // Делаем буквы заглавными
      event.target.value = event.target.value.toUpperCase();
      // Сохраняем в state
      this.setState({
         cardName: {
            label: this.state.cardName.label,
            maxLength: this.state.cardName.maxLength,
            value: event.target.value,
         }
      })
   }

   submitHandler = event => {
      const date = new Date;

      // Проверка на количество символов в номере карты (16 цифр и 3 пробела)
      if (this.state.cardNumber.value.length < 19) {

         const errorsCopy = [...this.state.errors]
         errorsCopy.push('Invalid card number')
         this.setState({
            errors: errorsCopy
         })

         alert('Invalid card number')
         event.preventDefault();
         return false;
      }

      // Проверка на количество символов в CVV
      if (this.state.cardCVV.value.length < 3) {
         const errorsCopy = [...this.state.errors]
         errorsCopy.push('Invalid card CVV')
         this.setState({
            errors: errorsCopy
         })
         alert('Invalid card CVV')
         event.preventDefault();
         return false;
      }

      // Проверка на количество символов в имени
      if (this.state.cardName.value.length < 3) {

         const errorsCopy = [...this.state.errors]
         errorsCopy.push('Invalid card name')
         this.setState({
            errors: errorsCopy
         })

         alert('Invalid card name')
         event.preventDefault();
         return false;
      }

      // Проверка на корректный месяц
      if (this.state.cardExpDate.month > 12 || this.state.cardExpDate.month < 0) {

         const errorsCopy = [...this.state.errors]
         errorsCopy.push('Invalid date of the month')
         this.setState({
            errors: errorsCopy
         })

         alert('Invalid date of the month')
         event.preventDefault();
         return false;
      }
      // Проверка на просрочку
      if (this.state.cardExpDate.year < date.getFullYear().toString().slice(2, 4) && !(this.state.errors.includes('Your card has expired'))) {

         const errorsCopy = [...this.state.errors]
         errorsCopy.push('Your card has expired')
         this.setState({
            errors: errorsCopy
         })

         alert('Your card has expired')
         event.preventDefault();
         return false;
      }
      // Проверка на просрочку если года совпадают (проверка месяцов)
      if (this.state.cardExpDate.year === date.getFullYear().toString().slice(2, 4)) {
         if (this.state.cardExpDate.month < (date.getMonth() + 1).toString && !(this.state.errors.includes('Your card has expired'))) {

            const errorsCopy = [...this.state.errors]
            errorsCopy.push('Your card has expired')
            this.setState({
               errors: errorsCopy
            })

            alert('Your card has expired')
            event.preventDefault();
            return false;
         }
      }

      const pushError = (error) => {
         const errorsCopy = [...this.state.errors]
         errorsCopy.push(error)
         this.setState({
            errors: errorsCopy
         })
      }
   }

}

export default Form;
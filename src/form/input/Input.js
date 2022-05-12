import './Input.css'

const Input = props => {

   return (
      // Тернарное выражение для того чтобы если дополнительный класс не указан, то props не будет возвращать undefined
      <label className={"form-label " + (props.extraClass ? props.extraClass : "")} style={props.style}>
         {props.label}:
         <input type={props.type} name={props.name} className="input" id={props.id} onChange={props.onChangeHandler} placeholder={props.placeholder} maxLength={props.maxLength} required />
      </label>
   )


}

export default Input

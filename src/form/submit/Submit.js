import './Submit.css'

const submit = props => {
   return (
      <input type="submit" className={"button " + props.extraClass} value={props.value} />
   )
}

export default submit
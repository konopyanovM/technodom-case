import './error.css'

const Error = (props) => {
   return (
      <li className='form-error'>{props.text}</li>
   )
}

export default Error;
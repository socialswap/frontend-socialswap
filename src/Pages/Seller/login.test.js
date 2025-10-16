import {render,screen} from '@testing-library/react'
import Login from './Login'


test('login page component properly render check',()=>{
     render(<Login/>)

    const emailInput = screen.getByRole('textbox')

    console.log(emailInput);


    expect(emailInput).toBeInTheDocument()
})
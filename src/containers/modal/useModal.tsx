import { useContext } from 'react'
import { modalContext } from '../ModalContext'
import { Form } from '../utils/Form'

// const arr: Field[] = [{ name: 'FirstName' }, { name: 'LastName' }]

export const useModal = () => {
    const { setContent } = useContext(modalContext)

    const createForm = () => {




        setContent(<Form fields={{
            name: {
                inputType: 'text'
            },
            surname: {
                inputType: 'text'
            }

        }} onSubmit={data => {
            alert(data.name)
        }}></Form>)
    }

    return () => {
        createForm()
    }
}

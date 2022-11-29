import { useState } from 'react'
import type { ModalProps } from '../generic/Modal'
import Modal from '../generic/Modal'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useEvent } from '~/hooks/react'

export default function SignInModal(props: Pick<ModalProps, 'open' | 'onClose'>) {
  const [form, setForm] = useState<'login' | 'register'>('login')
  const toggleForm = useEvent(() => {
    setForm((f) => (f === 'login' ? 'register' : 'login'))
  })

  return (
    <Modal {...props} size="md" stretch>
      <Modal.Title as="h3" className="font-bold text-gray-900 text-lg">
        {form === 'login' ? 'Login' : 'Register'}
      </Modal.Title>
      <Modal.Content>
        {form === 'login' && <LoginForm onSubmit={() => props.onClose?.(false)} />}
        {form === 'register' && <RegisterForm onSubmit={() => props.onClose?.(false)} />}
        <div className="w-full text-center text-sm text-gray-500 mt-6">
          <span
            className="hover:cursor-pointer hover:underline-offset-1 hover:underline hover:text-gray-700"
            onClick={toggleForm}
          >
            {form === 'login' ? 'No account? Sign up.' : 'Already an account? Sign in.'}
          </span>
        </div>
      </Modal.Content>
    </Modal>
  )
}

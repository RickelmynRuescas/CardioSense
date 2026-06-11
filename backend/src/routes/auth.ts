import { Router, Request, Response } from 'express'
import { auth } from '../config/firebase'

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' })
    return
  }

  try {
    const user = await auth.createUser({ email, password, displayName: name })
    res.status(201).json({ uid: user.uid, email: user.email, name: user.displayName })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/delete', async (req: Request, res: Response) => {
  const { uid } = req.body

  if (!uid) {
    res.status(400).json({ error: 'UID obrigatório' })
    return
  }

  try {
    await auth.deleteUser(uid)
    res.json({ message: 'Usuário removido com sucesso' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router

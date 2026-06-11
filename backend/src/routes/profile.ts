import { Router, Response } from 'express'
import { db } from '../config/firebase'
import { verifyToken, AuthRequest } from '../middlewares/auth'

const router = Router()

router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  const { age, sex, weight, height, hypertension, diabetes, cardiacHistory, medications, familyHistory } = req.body

  if (!age || !sex || !weight || !height) {
    res.status(400).json({ error: 'Dados obrigatórios: idade, sexo, peso e altura' })
    return
  }

  try {
    await db.collection('profiles').doc(req.userId!).set({
      age,
      sex,
      weight,
      height,
      hypertension: hypertension ?? null,
      diabetes: diabetes ?? null,
      cardiacHistory: cardiacHistory ?? null,
      medications: medications ?? null,
      familyHistory: familyHistory ?? null,
      updatedAt: new Date().toISOString(),
    })

    res.status(201).json({ message: 'Perfil salvo com sucesso' })
  } catch (error: any) {
    console.error('[PROFILE POST ERROR]', error.code, error.message, error)
    res.status(500).json({ error: error.message, code: error.code })
  }
})

router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const doc = await db.collection('profiles').doc(req.userId!).get()

    if (!doc.exists) {
      res.status(404).json({ error: 'Perfil não encontrado' })
      return
    }

    res.json(doc.data())
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router

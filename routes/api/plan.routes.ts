import {Router} from 'express'
import {
    addPlan,
    deletePlan,
    updatePlan
} from "../../controllers/plan.controller"

const planRoutes = Router()

planRoutes.post('/', addPlan)
planRoutes.delete('/:packageId/:planId', deletePlan)
planRoutes.put('/', updatePlan)

export default planRoutes
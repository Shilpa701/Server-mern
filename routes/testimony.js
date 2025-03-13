import express from 'express';
import { addTestimonyController, deletePropertyController, deleteTestimonyController, getAllApprovedController, getAllApprovedPropertyController, UpdateFeedbackStatusController, UpdatePropertyStatusController } from '../controller/testimonyController.js';
import { getAllTestimonyController } from '../controller/testimonyController.js';

const router = express.Router();

router.post('/add-testimony', addTestimonyController);

router.get('/all-feedback',getAllTestimonyController)


router.put("/update-feedback-status/:id", UpdateFeedbackStatusController);


router.get('/all-approved-feedback',getAllApprovedController)

router.put("/properties/:id/status",UpdatePropertyStatusController);

router.get('/all-approved-property',getAllApprovedPropertyController)

router.delete("/delete-feedback/:id", deleteTestimonyController);


router.delete("/properties/:id", deletePropertyController);




export default router;

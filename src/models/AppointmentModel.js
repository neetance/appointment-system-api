import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
    date: { type: Date, required: true },
    status: { type: String, required: true } // can take 2 values: 'free' or 'booked'
})

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;

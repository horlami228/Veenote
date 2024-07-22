import { createNote } from '../../controller/noteController';
import Note from '../../model/noteModel';
import User from '../../model/userModel';
import getFormattedDateTime from '../../utilities/dateTimeGenerator';

describe('createNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;



    it('should create a note and return 201', async () => {
        const mockNote = {
            save: jest.fn().mockResolvedValue({ fileName: 'default-2023-01-01-00-00-00', content: 'Test content' })
        };
        jest.spyOn(Note.prototype, 'save').mockImplementationOnce(mockNote.save);
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });



        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Note created successfully", data: { fileName: 'default-2023-01-01-00-00-00', content: 'Test content' } });
    });

    it('should return 400 if content is missing', async () => {
    

  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errorCode: 'MissingContent',
            errorMessage: "content is a required field",
            errorDetails: "The 'content' field is not present in the request body."
        });
    });

    it('should return 404 if user not found', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null);


        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note.prototype, 'save').mockRejectedValue(new Error('Database error'));
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });


        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error creating note",
            details: "Database error"
        });
    });

    it('should return 409 if note with same fileName exists', async () => {
        const mockNote = {
            save: jest.fn().mockRejectedValue({ code: 11000 })
        };
        jest.spyOn(Note.prototype, 'save').mockImplementationOnce(mockNote.save);
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });


        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            errorCode: 'DuplicateFileName',
            errorMessage: "Note with the provided fileName already exists",
            errorDetails: "A note with the same fileName already exists in the database. Please use a unique fileName."
        });
    });
});



describe('createNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;


    it('should create a note and return 201', async () => {
        const mockNote = {
            save: jest.fn().mockResolvedValue({ fileName: 'default-2023-01-01-00-00-00', content: 'Test content' })
        };
        jest.spyOn(Note.prototype, 'save').mockImplementationOnce(mockNote.save);
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });



        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Note created successfully", data: { fileName: 'default-2023-01-01-00-00-00', content: 'Test content' } });
    });

    it('should return 400 if content is missing', async () => {




        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errorCode: 'MissingContent',
            errorMessage: "content is a required field",
            errorDetails: "The 'content' field is not present in the request body."
        });
    });

    it('should return 404 if user not found', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null);


        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note.prototype, 'save').mockRejectedValue(new Error('Database error'));
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });



        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error creating note",
            details: "Database error"
        });
    });

    it('should return 409 if note with same fileName exists', async () => {
        const mockNote = {
            save: jest.fn().mockRejectedValue({ code: 11000 })
        };
        jest.spyOn(Note.prototype, 'save').mockImplementationOnce(mockNote.save);
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });

       

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            errorCode: 'DuplicateFileName',
            errorMessage: "Note with the provided fileName already exists",
            errorDetails: "A note with the same fileName already exists in the database. Please use a unique fileName."
        });
    });
});



describe('updateNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;



    it('should update a note and return 200', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue({
            _id: 'noteId',
            content: 'Updated content',
            save: jest.fn()
        });

        

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note updated successfully"
        });
    });

    it('should return 404 if note not found', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue(null);

       

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note not found"
        });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));

        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error updating note",
            details: "Database error"
        });
    });
});


describe('updateNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    it('should update a note and return 200', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue({
            _id: 'noteId',
            content: 'Updated content',
            save: jest.fn()
        });

       
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note updated successfully"
        });
    });

    it('should return 404 if note not found', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue(null);

       

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note not found"
        });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));

        

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error updating note",
            details: "Database error"
        });
    });
});



describe('updateNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;



    it('should update a note and return 200', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue({
            _id: 'noteId',
            content: 'Updated content',
            save: jest.fn()
        });


        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note updated successfully"
        });
    });

    it('should return 404 if note not found', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue(null);

       

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note not found"
        });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));


        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message:
             "Error updating note",
            details: "Database error"
        });
    });
});




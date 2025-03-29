const { login } = require('../authController');
const User = require('../User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../User');  // Mock User model
jest.mock('bcryptjs'); // Mock bcrypt
jest.mock('jsonwebtoken'); // Mock jwt

describe('Auth Controller - login', () => {
    let req;
    let res;

    beforeEach(() => {
    // Mocked request and response
    req = {
        body: {
        username: 'testuser',
        password: 'password123'
        }
    };

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    jest.clearAllMocks();
    });

    test('should return token on successful login', async() => {
        const mockUser = {
            _id: 'userId123',
            username: 'testuser',
            password: 'hashedpassword'
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockedToken');

        await login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({username: 'testuser'});
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'userId123', username: 'testuser' },
            process.env.JWT_SECRET,
            {expiresIn: '1h' }
        );

        expect(res.json).toHaveBeenCalledWith({ token: 'mockedToken' });
    });

    test('should return 400 if user not found', async () => {
        User.findOne.mockResolvedValue(null);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    test('should return 400 if password does not match', async () => {
        const mockUser = {
            _id: 'userId123',
            username: 'testuser',
            password: 'hashedpassword'
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
    });

    test('should hanlde server errors and return 500', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await login(req, res);

        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error'});

        consoleSpy.mockRestore();
    });
});
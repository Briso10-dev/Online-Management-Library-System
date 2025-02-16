import {body} from 'express-validator'

//verifying non empty users fields
export const userValidator = [
  body('name', 'Invalid should not be Empty').not().isEmpty(),
  body('email','Invalid should not be Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'password does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]
// verifying non empty books fields
export const bookValidator = [
  body('title', 'Invalid should not be Empty').not().isEmpty(),
  body('author','Invalid should not be Empty').not().isEmpty(),
  body('author','Inavalid should be in uppercase').not().isUppercase(),
  body('publicationYear', 'Invalid should not be Empty').not().isEmpty(),
  body('publicationYear', 'Invalid,enter a correct year').isLength({min:4}),
  body('ISBN','Inavalid does not Empty').not().isEmpty(),
]
export const borrowValidator = [
  body('bookID', 'Invalid should not be Empty').not().isEmpty(),
  body('userID','Invalid should not be Empty').not().isEmpty(),
  body('bookID', 'Invalid should enter a valid bookID').isMongoId(),
  body('userID', 'Invalid should enter a valid userID').isMongoId()
]
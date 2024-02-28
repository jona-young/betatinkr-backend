// Error handling
const handleUserErrors = (err) => {
    let errors = { firstName: '', lastName: '', email: '', password: '' }

    // Incorrect login email
    if (err.message === 'incorrect email')
    {
        errors.email = "That email is not registered!";
    } 

    //Incorrect login password
    if (err.message === 'incorrect password')
    {
        errors.password = 'That password is incorrect';
    }

    // Duplicate email error
    if (err.code === 11000)
    {
        errors.email = 'That email is already registered!';
        return errors;
    }

    // Validation errors
    if (err.message.includes('user validation failed: '))
    {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const handleTrainingPlanErrors = (err) => {
    let errors = { name: '', startDate: '', endDate: '', activityType: '', weeksPerBlock: '', deloadWeek: '', workoutsPerWeek: '' }

    console.log('hoi hoi: ', err.message)
    // Incorrect login email
    if (err.message === 'incorrect email')
    {
        errors.email = "That email is not registered!";
    } 

    //Incorrect login password
    if (err.message === 'incorrect password')
    {
        errors.password = 'That password is incorrect';
    }

    // Duplicate email error
    if (err.code === 11000)
    {
        errors.email = 'That email is already registered!';
        return errors;
    }

    // Validation errors
    if (err.message.includes('trainingplan validation failed: '))
    {
        Object.values(err.errors).forEach(({ properties }) => {
            if (properties.path == 'name') {
                errors[properties.path] = "Please enter a training plan name";
            } else if (properties.path == 'activityType') {
                errors[properties.path] = "Please enter an activity type"
            } else {
                errors[properties.path] = properties.message;
            }
        });
    }

    return errors;
}

module.exports = { handleUserErrors, handleTrainingPlanErrors }
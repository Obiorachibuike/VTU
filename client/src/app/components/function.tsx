const validateInput = (name:any,email:string, password:string,confirmPassword:string) => {
    const errors:any = [];

    if (!name.trim()) {
      errors.push("Name is required");

    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push("Invalid email format");
    }

    if (!password.trim() || password.length < 8) {
      errors.push("Password must be at least 8 characters long");
      console.log(errors);
    }
    if (password !== confirmPassword) {
      errors.push("Password are not the same");
      console.log(errors);
      
    }

    return errors;

  };

  export default validateInput
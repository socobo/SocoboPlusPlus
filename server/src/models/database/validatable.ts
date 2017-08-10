export interface Validatable {

    /**
     * This method deeply assigns all properties of the provided
     * obj to the owning obj.
     */
    of (objToClone: Validatable): Validatable;
}

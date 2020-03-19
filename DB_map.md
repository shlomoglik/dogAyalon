# DB map 
- Clients (clients<->users)
    - {client}
        - clientName:string
        - clientEmail:string
        - Contacts
            - clientName:string
            - clientEmail:string
        - Dogs
            - {dog}
                - dogName:string
                - dogBreed:string
                - dogDOB:Date
        - Invitations
            - {invite}
                - dogRef:string
                - sDate:Date
                - eDate:Date

        

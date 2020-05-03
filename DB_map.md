<!-- TOOD: login + sign in + remove invitation + admin panel!!!-->

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
                - dogs:[docRef:string]
                - contacts:[contactRef:string]
                - sDate:string
                - eDate:string
                - sTime:string
                - eTime:string

        

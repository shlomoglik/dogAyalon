<!-- TOOD:
    - admin panel:
        - all contacts by client grouping  , using search: clientName,clientEmail,clientEmailPhone,dogName
        - all dogs by client grouping  , using search: clientName,clientEmail,clientEmailPhone,dogName
        - all invitation by client grouping  , using dates filter + status filter
        - check-ins + check-outs
    - create register form
    - validation procces : email verify? phone verify ?  
    - create user photo uploader
    - create nav tabs query by param ex: /app/invite?tab=dogs 
    - create date display view for dob -> age based
    - main nav styling + animation + icons + logout
-->

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

        

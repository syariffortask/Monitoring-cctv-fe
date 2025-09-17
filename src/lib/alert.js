import Swal from "sweetalert2";

export function alertError(tittle,msg) {
    Swal.fire({
        icon: 'error',
        iconColor: '#1E2939',
        title: tittle,
        text: msg,
        showConfirmButton: false,
        timer: 1500
        
    })
}

export function alertSuccess(tittle,msg) {
    Swal.fire({
        icon: 'success',
        title: tittle,
        text: msg,
        showConfirmButton: false,
        timer: 1500
        
    })
}
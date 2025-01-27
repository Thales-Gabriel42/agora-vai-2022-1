import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField'
import AlertBar from '../ui/AlertBar'
import Backdrop from '@mui/material/Backdrop';
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import api from '../api'

export default function LoginForm() {

    const [state, setState] = React.useState({
        email: '',
        senha: '',
        resultado: '',
        aguardando: false,
        alertBarOpe: false,
        alertBarMsg: '',
        alertBarSeverity: 'success'
    })
    
    const { 
        email, 
        senha, 
        resultado, 
        aguardando,
        alertBarOpen,
        alertBarMsg,
        alertBarSeverity 
      } = state

    function handleInputChange(event){
        setState({...state, [event.target.id]: event.target.value})
    }

    async function handleFormSubmit(event){
        setState({...state, aguardando: true})
        event.preventDefault()
        try{
            const result = await api.post('usuario/login', {json: {email, senha}}).json()
            // Armazena o token no session storage
            //window.sessionStorage.setItem('app-data', result.data?.token)
            setState({
                ...state, 
                resultado: result, 
                aguardando: false,
                alertBarOpen: true,
                alertBarSeverity: 'success',
                alertBarMsg: 'Autenticação efetuada com sucesso'
            })
        }
        catch(error){
            setState({
                ...state, 
                resultado: 'ERRO: ' + error.message, 
                aguardando: false,
                alertBarOpen: true,
                alertBarSeverity: 'error',
                alertBarMsg: 'ERRO: ' + error.message
              })
        }
    }

    return(
        <>
            <AlertBar 
                severity={alertBarSeverity} 
                open={alertBarOpen}
                onClose={() => setState({...state, alertBarOpen: false})}
            >
                {alertBarMsg}
            </AlertBar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={aguardando}
            >
                 <CircularProgress color="inherit" />
            </Backdrop>
            <h1 style={{ textAlign:'center'}}>Autentique-se</h1>
            <Paper elevation={4} sx={{
                maxWidth: '300px',
                width: '90%',
                margin: '0 auto',
                padding: '30px'
            }}>
                <form onSubmit={handleFormSubmit}>
                    <TextField sx={{ marginBottom: '30px'}}
                        id="email" 
                        label="E-mail"
                        value={email}
                        variant="filled"
                        placeholder="Informe o e-mail"
                        required
                        fullWidth
                        onChange={handleInputChange}
                    />

                    <TextField sx={{ marginBottom: '30px'}}
                        id="senha"
                        type="password"
                        label="Senha"
                        value={senha}
                        variant="filled"
                        placeholder="Informe a senha"
                        required
                        fullWidth
                        onChange={handleInputChange}
                    />
                    <Toolbar sx={{
                        width: '100%',
                        justifyContent: 'space-around' ,
                        padding: '0 !important'
                    }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            disabled={(email.trim() === '') || (senha.trim() === '')}
                        >
                            Enviar
                        </Button>
                    </Toolbar>
                </form>
            </Paper>
        </>
    )
}
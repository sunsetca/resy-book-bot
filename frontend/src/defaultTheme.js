export const defaultTheme = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
      },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px',
        marginBottom: '20px',
    },
    button: {
        marginTop: '20px',
        width: '100%',
        maxWidth: '400px',
    },
    components: {
        Box: {
         styleOverride: {
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
         }
        },
        MuiDivider: {
            styleOverride: {
                root: {
                    height:'100%',
                    backgroundColor: "black"
                }
            }
          }
    }
      
}
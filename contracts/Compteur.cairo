
# On déclare ce fichier comme un fichier starknet
%lang starknet
# on ajoute les dépendances de base à notre contrat
from starkware.cairo.common.cairo_builtins import HashBuiltin

# on définit une variable simple pour faire notre compteur
@storage_var
func compteur_storage() -> (res : felt):
end

# Dans le constructeur vous noterez des déclarations implicites de nos librairies cryptographiques
# ces paramètres sont entre "{}"
# syscall_ptr : felt*,  => vous permet l'accès à read et write pour écrire dans vos variables de stockage
# pedersen_ptr : HashBuiltin* => pour exécuter les hash pedersen
# range_check_ptr => permet la comparaison de nombre.
@constructor
func constructor{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr
} (compteur_initial : felt):
    # .write() permet d'écrire dans notre storage
    compteur_storage.write(compteur_initial)
    return ()
end

# Fonction pour incrémenter notre compteur
@external
func incrementer_compteur{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
}(montant : felt):
    # .read()  permet de lire notre storage
    let (res) = compteur_storage.read()
    compteur_storage.write(res + montant)
    return ()
end

# Returns the current compteur.
@view
func recuperer_compteur{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr
}() -> (res : felt):
    let (res) = compteur_storage.read()
    return (res)
end
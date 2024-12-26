from netmiko import ConnectHandler

# Définir l'adresse IP du routeur
ip_address = '192.168.42.253'
print(f"-------------Connexion à {ip_address}---------")

# Se connecter au routeur via Telnet
connection = ConnectHandler(host=ip_address, port=23, username='WEB', password='123', device_type='cisco_ios_telnet')

# Fonction pour ajouter un VLAN
def add_vlan(vlan_id, vlan_name):
    print(f"Ajout du VLAN {vlan_id} avec le nom {vlan_name}")
    config_commands = [
        'configure terminal',  # Passer en mode configuration globale
        f'vlan {vlan_id}',  # Créer le VLAN
        f'name {vlan_name}',  # Nommer le VLAN
        'exit',  # Quitter le mode VLAN
        'end'  # Quitter le mode configuration
    ]
    output = connection.send_config_set(config_commands)  # Envoi de la configuration
    return output

# Fonction pour supprimer un VLAN
def delete_vlan(vlan_id):
    print(f"Suppression du VLAN {vlan_id}")
    config_commands = [
        'configure terminal',  # Passer en mode configuration globale
        f'no vlan {vlan_id}',  # Supprimer le VLAN
        'end'  # Quitter le mode configuration
    ]
    output = connection.send_config_set(config_commands)  # Envoi de la configuration
    return output

# Fonction pour modifier un VLAN
def modify_vlan(vlan_id, new_name):
    print(f"Modification du VLAN {vlan_id} en {new_name}")
    config_commands = [
        f'vlan {vlan_id}',  # Sélectionner le VLAN
        f'name {new_name}',  # Changer le nom du VLAN
        'exit',  # Quitter le mode VLAN
        'end'  # Quitter le mode configuration
    ]
    output = connection.send_config_set(config_commands)  # Envoi de la configuration
    return output

# Affichage de l'état des interfaces IP pour vérifier les VLANs
def show_ip_interfaces():
    output = connection.send_command('show vlan brief')
    return output

# Exemple d'utilisation des fonctions :
# 1. Ajouter un VLAN (ID: 10, Nom: 'Marketing')
add_vlan_output = add_vlan(20, 'IT')
print("Sortie de l'ajout du VLAN :")
print(add_vlan_output)

# 2. Modifier un VLAN (ID: 10, Nouveau nom: 'R&D')
modify_vlan_output = modify_vlan(20, 'Marketing')
print("Sortie de la modification du VLAN :")
print(modify_vlan_output)

# 3. Supprimer un VLAN (ID: 10)
delete_vlan_output = delete_vlan(10)
print("Sortie de la suppression du VLAN :")
print(delete_vlan_output)

# 4. Afficher les interfaces pour vérifier les VLANs
interface_output = show_ip_interfaces()
print("Sortie de la commande 'show vlan brief :")
print(interface_output)

# Fermer la connexion Telnet
connection.disconnect()




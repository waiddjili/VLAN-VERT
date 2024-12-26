import sys
from netmiko import ConnectHandler

def connect_to_switch():
    # Connexion au switch
    return ConnectHandler(
        host='192.168.42.253',
        port=23,
        username='WEB',
        password='123',
        device_type='cisco_ios_telnet'
    )

def save_configuration(connection):
    # Sauvegarder la configuration
    connection.send_command('write')  # Utilisation de la commande 'write' pour sauvegarder

def add_vlan(vlan_id, vlan_name):
    try:
        connection = connect_to_switch()
        config_commands = [f'vlan {vlan_id}', f'name {vlan_name}']
        connection.send_config_set(config_commands)
        save_configuration(connection)
        connection.disconnect()

        return f"VLAN {vlan_id} added successfully"
    except Exception as e:

        return f"Error adding VLAN {vlan_id}: {e}"

def delete_vlan(vlan_id):
    try:
        connection = connect_to_switch()
        config_commands = [f'no vlan {vlan_id}']
        connection.send_config_set(config_commands)
        save_configuration(connection)
        connection.disconnect()
        return f"VLAN {vlan_id} deleted successfully."
    except Exception as e:
        return f"Error deleting VLAN {vlan_id}: {e}"

def modify_vlan(vlan_id, new_name):
    try:
        connection = connect_to_switch()
        config_commands = [f'vlan {vlan_id}', f'name {new_name}']
        connection.send_config_set(config_commands)
        save_configuration(connection)
        connection.disconnect()
        return f"VLAN {vlan_id} renamed to {new_name} successfully."
    except Exception as e:
        return f"Error modifying VLAN {vlan_id}: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Insufficient arguments. Provide action, vlan_id and vlan_name (optional).")
        sys.exit(1)

    action = sys.argv[1]
    vlan_id = sys.argv[2]

    # Utilisation de la fonction appropriée en fonction de l'action
    if action == 'add':
        vlan_name = sys.argv[3] if len(sys.argv) > 3 else ''
        result = add_vlan(vlan_id, vlan_name)
    elif action == 'delete':
        result = delete_vlan(vlan_id)
    elif action == 'modify':
        vlan_name = sys.argv[3] if len(sys.argv) > 3 else ''
        result = modify_vlan(vlan_id, vlan_name)
    else:
        print(f"Unknown action: {action}")
        sys.exit(1)

    print(result)

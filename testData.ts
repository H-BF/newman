export const networks = {
	"networks": {
		"networks": [
			{
				"name": "nw-0",
				"network": {
					"CIDR": "10.150.0.220/32"
				}
			},
			{
				"name": "nw-1",
				"network": {
					"CIDR": "10.150.0.221/32"
				}
			},
			{
				"name": "nw-2",
				"network": {
					"CIDR": "10.150.0.222/32"
				}
			},
			{
				"name": "nw-3",
				"network": {
					"CIDR": "10.150.0.223/32"
				}
			},
			{
				"name": "nw-4",
				"network": {
					"CIDR": "10.150.0.224/32"
				}
			},
			{
				"name": "nw-5",
				"network": {
					"CIDR": "20.150.0.225/28"
				}
			}
		]
	},
	"syncOp": "FullSync"
}


export const sg = {
	"groups": {
		"groups": [
			{
				"name": "sg-0",
				"networks": [
					"nw-0", "nw-1"
				]
			},
			{
				"name": "sg-1",
				"networks": [
					"nw-2"
				]
			},
			{
				"name": "sg-2",
				"networks": [
					"nw-3"
				]
			},
			{
				"name": "sg-3",
				"networks": [
					"nw-4"
				]
			},
			{
				"name": "sg-4",
				"networks": [
					"nw-5"
				]
			}			
		]
	},
	"syncOp": "FullSync"
}

export const rules = {
	"sgRules": {
		"rules": [
			{
				"ports": [
					{
						"s": "",
						"d": "5000"
					}
				],
				"sgFrom": "sg-1",
				"sgTo": "sg-0",
				"transport": "TCP"
			},
			{
				"ports": [
					{
						"s": "",
						"d": "5600-5900"
					}
				],
				"sgFrom": "sg-1",
				"sgTo": "sg-3",
				"transport": "UDP"
			},
			{
				"ports": [
					{
						"s": "4444",
						"d": "7000"
					},
					{
						"s": "4445",
						"d": "7300-7500"
					},
					{
						"s": "4446",
						"d": "7600-7700, 7800"
					}
				],
				"sgFrom": "sg-0",
				"sgTo": "sg-2",
				"transport": "TCP"
			},
			{
				"ports": [
					{
						"s": "9999-1050",
						"d": "23000-23500"
					}
				],
				"sgFrom": "sg-3",
				"sgTo": "sg-2",
				"transport": "UDP"
			},
			{
				"ports": [
					{
						"s": "8888, 1000-2000",
						"d": "55000, 56000-57000"
					},
					{
						"s": "7777, 45000-46000",
						"d": "60000"
					}
				],
				"sgFrom": "sg-3",
				"sgTo": "sg-4",
				"transport": "TCP"
			}
		]
	},
	"syncOp": "FullSync"
}
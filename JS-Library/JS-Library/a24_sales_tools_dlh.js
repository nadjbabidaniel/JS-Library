/*!
* Function executes WF "RESERVIERUNGSANFRAGE | Reservierungsanfrage angenommen"
* 
* Params  :
*           FirstPrimaryItemId - Current opportunity Id
* Returns : 
*/
function Sales_tools_dlh_CreateQuote(FirstPrimaryItemId) {

    debugger;

    var serverURL = Xrm.Page.context.getClientUrl();

    var RequestText = '-';

    // Get data from plugin
    try {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            url: serverURL + "/XRMServices/2011/OrganizationData.svc/a24_dlh_requestrouterSet?$" +
                                                                    "select=a24_requesttype_str,a24_entitytypename_str,a24_ids_txt,a24_errorcode_int,a24_responsetext_txt&$" +
                                                                    "filter=a24_requesttype_str eq 'create_quote_dlh' and a24_entitytypename_str eq '" + 'opportunity' +
                                                                    "' and a24_requesttext_str eq '" + RequestText +
                                                                    "' and a24_ids_txt eq '" + FirstPrimaryItemId + "'",
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.             
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus) {
                if (data && data.d && data.d.results) {
                    for (var i = 0; i < data.d.results.length; i++) {

                        //debugger;

                        var a24_dlh_requestrouter = data.d.results[i];

                        // Somethin is wrong, it must never be null.
                        if (a24_dlh_requestrouter.a24_responsetext_txt == null) {
                            alert('Error, a24_dlh_requestrouter.a24_responsetext_txt is null!');
                            return;
                        }

                        // ErrorDuringExecution - set from Plugin, it has also error text.
                        if (a24_dlh_requestrouter.a24_responsetext_txt.indexOf('ErrorDuringExecution') == 0) {
                            alert(a24_dlh_requestrouter.a24_responsetext_txt);
                            return;
                        }

                        var url = Xrm.Page.context.getClientUrl();

                        var request = "<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>" +
                              "<s:Body>" +
                                "<Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>" +
                                  "<request i:type='b:ExecuteWorkflowRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>" +
                                    "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>" +
                                      "<a:KeyValuePairOfstringanyType>" +
                                        "<c:key>EntityId</c:key>" +
                                        "<c:value i:type='d:guid' xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/'>" + FirstPrimaryItemId + "</c:value>" +
                                      "</a:KeyValuePairOfstringanyType>" +
                                      "<a:KeyValuePairOfstringanyType>" +
                                        "<c:key>WorkflowId</c:key>" +
                                        "<c:value i:type='d:guid' xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/'>" + "DA6C8BED-48E4-4F3C-9BE0-C64942C52F6B" + "</c:value>" +
                                      "</a:KeyValuePairOfstringanyType>" +
                                    "</a:Parameters>" +
                                    "<a:RequestId i:nil='true' />" +
                                    "<a:RequestName>ExecuteWorkflow</a:RequestName>" +
                                  "</request>" +
                                "</Execute>" +
                              "</s:Body>" +
                            "</s:Envelope>";

                        var req = new XMLHttpRequest();
                        req.open("POST", url + "/XRMServices/2011/Organization.svc/web", true);

                        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                        req.onreadystatechange = function () {
                            if (req.readyState == 4) {
                                if (req.status == 200) {
                                    console.log("WF wurde ausgeführt.1 SUCCESS");



                                    $.ajax({
                                        type: "GET",
                                        contentType: "application/json; charset=utf-8",
                                        datatype: "json",
                                        async: true,
                                        url: serverURL + "/XRMServices/2011/OrganizationData.svc/QuoteSet?$" +
                                                                    "select=QuoteId,QuoteNumber,CreatedOn,Name&$" +
                                                                    "filter=OpportunityId/Id eq guid'" + FirstPrimaryItemId + "'",


                                        beforeSend: function (XMLHttpRequest) {
                                            //Specifying this header ensures that the results will be returned as JSON.             
                                            XMLHttpRequest.setRequestHeader("Accept", "application/json");
                                        },
                                        success: function (data, textStatus) {

                                            if (data && data.d && data.d.results) {
                                                for (var i = 0; i < data.d.results.length; i++) {
                                                    console.log("Testttt1 ", data.d.results[i].Name);
                                                    console.log("Testttt2 ", data.d.results[i].CreatedOn);
                                                }
                                            }                                                                                    

                                            //Xrm.Utility.openEntityForm("quote", "d207d910-8790-e611-80f2-5065f38b03e1");


                                            var serverUrl = Xrm.Page.context.getClientUrl();

                                            var odataSelect = serverUrl + "/xrmservices/2011/OrganizationData.svc/WorkflowSet?$select=WorkflowId&$filter=StateCode/Value eq 1 and ParentWorkflowId/Id eq null and Name eq 'RESERVIERUNGSANFRAGE | Reservierungsanfrage angenommen'";

                                            var xmlHttp = new XMLHttpRequest();
                                            xmlHttp.open("GET", odataSelect, false);
                                            xmlHttp.send();

                                            if (xmlHttp.status == 200) {
                                                var result = xmlHttp.responseText;

                                                //var xmlDoc;
                                                //if (window.DOMParser) { // Firefox, Chrome, Opera, etc.
                                                //    parser = new DOMParser();
                                                //    xmlDoc = parser.parseFromString(result, "text/xml");
                                                //}
                                                //else // Internet Explorer
                                                {
                                                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                                                    xmlDoc.async = false;
                                                    xmlDoc.loadXML(result);
                                                }

                                                var id = xmlDoc.getElementsByTagName("d:WorkflowId")[0].childNodes[0].nodeValue;

                                                alert("ID: ", id);
                                                if (id === "DA6C8BED-48E4-4F3C-9BE0-C64942C52F6B") alert("EQUAL");
                                                else alert("FALSE");
                                            }



                                        }
                                    });



                                }
                                else {
                                    console.log("WF wurde ausgeführt.1 ERROR");
                                }
                            }
                        }
                    };

                    req.send(request);

                    console.log("WF wurde ausgeführt.1" + a24_dlh_requestrouter.a24_responsetext_txt + FirstPrimaryItemId);

                    return;
                }
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {
                debugger;
                alert(textStatus + ": " + XMLHttpRequest.responseText);
            }
        });
    }
    catch (err) {
        debugger;
        alert('Error: ' + err);
    }
}


/*!
* Function executes WF by its name, entity name and entity Id.
* For Async WF it will not wait until execution is finished.
*
* Params  :
*           WFName              - Name of the WF to start
*           FirstPrimaryItemId  - Record Id
*           EntityTypeName      - Entity name
* Returns : 
*/
function WfStartByWfNameEntityIdName(WFName, FirstPrimaryItemId, EntityTypeName, FinalMessage, FormRefresh) {

    debugger;

    var serverURL = Xrm.Page.context.getClientUrl();

    if (WFName == null || WFName == '') {
        alert('Error in function WfStartByWfNameEntityIdName : Parameter name WFName can not be empty!');
        return;
    }

    var WFNameBase64Str = Base64.encode(WFName);

    var RequestText = 'WorkflowFrontendName-' + WFNameBase64Str + '|';

    // Get data from plugin
    try {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            url: serverURL + "/XRMServices/2011/OrganizationData.svc/a24_dlh_requestrouterSet?$" +
                                                                    "select=a24_requesttype_str,a24_entitytypename_str,a24_ids_txt,a24_errorcode_int,a24_responsetext_txt&$" +
                                                                    "filter=a24_requesttype_str eq 'wf_start_by_wf_name_entity_id_name' and a24_entitytypename_str eq '" + EntityTypeName +
                                                                    "' and a24_requesttext_str eq '" + RequestText +
                                                                    "' and a24_ids_txt eq '" + FirstPrimaryItemId + "'",
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.             
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XMLHttpRequest) {
                if (data && data.d && data.d.results) {
                    for (var i = 0; i < data.d.results.length; i++) {

                        //debugger;

                        var a24_dlh_requestrouter = data.d.results[i];

                        // Somethin is wrong, it must never be null.
                        if (a24_dlh_requestrouter.a24_responsetext_txt == null) {
                            alert('Error, a24_dlh_requestrouter.a24_responsetext_txt is null. Is a24_dlh_requestrouter Plugin installed ?');
                            return;
                        }

                        // ErrorDuringExecution - set from Plugin, it has also error text.
                        if (a24_dlh_requestrouter.a24_responsetext_txt.indexOf('ErrorDuringExecution') == 0) {
                            alert(a24_dlh_requestrouter.a24_responsetext_txt);
                            return;
                        }

                        if (FinalMessage == null || FinalMessage == '') {
                        }
                        else
                            alert(FinalMessage);

                        if (FormRefresh)
                            Xrm.Page.data.refresh(true).then(null, null);

                        return;
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                debugger;
                alert(textStatus + ": " + XMLHttpRequest.responseText);
            }
        });

    }
    catch (err) {
        debugger;
        alert('Error: ' + err);
    }
}

/*!
* Function executes WF "RESERVIERUNGSANFRAGE | Reservierungsanfrage abgelehnt"
* 
* Params  :
*           FirstPrimaryItemId - Current opportunity Id
* Returns : 
*/
function Sales_tools_dlh_CancelOpportunity(FirstPrimaryItemId) {

    debugger;

    var serverURL = Xrm.Page.context.getClientUrl();

    var RequestText = '-';

    // Get data from plugin
    try {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            async: true,
            url: serverURL + "/XRMServices/2011/OrganizationData.svc/a24_dlh_requestrouterSet?$" +
                                                                    "select=a24_requesttype_str,a24_entitytypename_str,a24_ids_txt,a24_errorcode_int,a24_responsetext_txt&$" +
                                                                    "filter=a24_requesttype_str eq 'cancel_opportunity_dlh' and a24_entitytypename_str eq '" + 'opportunity' +
                                                                    "' and a24_requesttext_str eq '" + RequestText +
                                                                    "' and a24_ids_txt eq '" + FirstPrimaryItemId + "'",
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.             
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XMLHttpRequest) {
                if (data && data.d && data.d.results) {
                    for (var i = 0; i < data.d.results.length; i++) {

                        //debugger;

                        var a24_dlh_requestrouter = data.d.results[i];

                        // Somethin is wrong, it must never be null.
                        if (a24_dlh_requestrouter.a24_responsetext_txt == null) {
                            alert('Error, a24_dlh_requestrouter.a24_responsetext_txt is null!');
                            return;
                        }

                        // ErrorDuringExecution - set from Plugin, it has also error text.
                        if (a24_dlh_requestrouter.a24_responsetext_txt.indexOf('ErrorDuringExecution') == 0) {
                            alert(a24_dlh_requestrouter.a24_responsetext_txt);
                            return;
                        }

                        alert("WF wurde ausgeführt.2" + a24_dlh_requestrouter.a24_responsetext_txt);

                        return;
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                debugger;
                alert(textStatus + ": " + XMLHttpRequest.responseText);
            }
        });

    }
    catch (err) {
        debugger;
        alert('Error: ' + err);
    }
}



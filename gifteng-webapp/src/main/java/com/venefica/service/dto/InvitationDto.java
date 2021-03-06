/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.venefica.service.dto;

import com.venefica.model.Invitation;
import com.venefica.model.UserType;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

/**
 * Describes an invitation data transfer object.
 * 
 * @author gyuszi
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class InvitationDto extends DtoBase {
    
    // in
    private String email;
    // in
    private String ipAddress;
    // in
    private String country;
    // in
    private String zipCode;
    // in
    private String source;
    // in
    private String otherSource;
    // in
    private UserType userType;

    public InvitationDto() {
    }

    public void update(Invitation invitation) {
        invitation.setEmail(email);
        invitation.setIpAddress(ipAddress);
        invitation.setCountry(country);
        invitation.setZipCode(zipCode);
        invitation.setSource(source);
        invitation.setOtherSource(otherSource);
        invitation.setUserType(userType);
    }
    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getOtherSource() {
        return otherSource;
    }

    public void setOtherSource(String otherSource) {
        this.otherSource = otherSource;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
}
